import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';

const app = express();
const PORT = 3000;

// Initialize Database
const db = new Database('biochar.db');

// Setup tables
db.exec(`
  DROP TABLE IF EXISTS agricultural_data;
  DROP TABLE IF EXISTS crops;
  DROP TABLE IF EXISTS provinces;
  DROP TABLE IF EXISTS crop_factors;

  CREATE TABLE IF NOT EXISTS provinces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_th TEXT NOT NULL,
    name_en TEXT NOT NULL,
    region TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS crops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS crop_factors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop_id INTEGER NOT NULL,
    region TEXT NOT NULL,
    yp REAL NOT NULL, -- Yield per rai (tons/rai)
    residual_name TEXT NOT NULL,
    rpr REAL NOT NULL, -- Residual-to-Product Ratio
    af REAL NOT NULL, -- Availability Factor (0-1)
    ybc REAL NOT NULL, -- Biochar Yield
    FOREIGN KEY(crop_id) REFERENCES crops(id)
  );

  CREATE TABLE IF NOT EXISTS agricultural_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    province_id INTEGER,
    crop_id INTEGER,
    year INTEGER NOT NULL,
    planted_area REAL NOT NULL, -- Area in rai
    FOREIGN KEY(province_id) REFERENCES provinces(id),
    FOREIGN KEY(crop_id) REFERENCES crops(id)
  );
`);

// Seed data
const provinceCount = db.prepare('SELECT COUNT(*) as count FROM provinces').get() as { count: number };
if (provinceCount.count === 0) {
  const insertProvince = db.prepare('INSERT INTO provinces (name_th, name_en, region) VALUES (?, ?, ?)');
  const provinces = [
    ['เชียงใหม่', 'Chiang Mai', 'เหนือ'],
    ['นครราชสีมา', 'Nakhon Ratchasima', 'ตะวันออกเฉียงเหนือ'],
    ['ขอนแก่น', 'Khon Kaen', 'ตะวันออกเฉียงเหนือ'],
    ['สุพรรณบุรี', 'Suphan Buri', 'กลาง'],
    ['นครสวรรค์', 'Nakhon Sawan', 'กลาง'],
    ['สุราษฎร์ธานี', 'Surat Thani', 'ใต้'],
    ['สงขลา', 'Songkhla', 'ใต้'],
    ['ชลบุรี', 'Chon Buri', 'ตะวันออก'],
    ['กาญจนบุรี', 'Kanchanaburi', 'ตะวันตก'],
    ['ร้อยเอ็ด', 'Roi Et', 'ตะวันออกเฉียงเหนือ']
  ];
  provinces.forEach(p => insertProvince.run(p));

  const insertCrop = db.prepare('INSERT INTO crops (name) VALUES (?)');
  const cropNames = ['ข้าวนาปี', 'ข้าวนาปรัง', 'ข้าวโพด', 'อ้อย', 'มันสำปะหลัง', 'ปาล์มน้ำมัน'];
  cropNames.forEach(c => insertCrop.run(c));

  const insertFactor = db.prepare('INSERT INTO crop_factors (crop_id, region, yp, residual_name, rpr, af, ybc) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
  const regions = ["เหนือ", "กลาง", "ตะวันออกเฉียงเหนือ", "ตะวันออก", "ตะวันตก", "ใต้"];
  
  const factorData = {
    "ข้าวนาปี": {
      yp: [0.677, 0.789, 0.699, 0.616, 0.840, 0.724],
      ybc: 0.3,
      residuals: {
        "ฟางข้าว": { rpr: [1.029, 1.084, 1.025, 0.954, 1.730, 1.190], af: [41.7, 83.3, 66.7, 100, 0, 58.3] },
        "แกลบ": { rpr: [0.362, 0.250, 0.356, 0.367, 0.210, 0.302], af: [0.481, 0.481, 0.481, 0.481, 0.481, 0.481] }
      }
    },
    "ข้าวนาปรัง": {
      yp: [0.677, 0.789, 0.699, 0.616, 0.840, 0.724],
      ybc: 0.3,
      residuals: {
        "ฟางข้าว": { rpr: [1.682, 1.667, 1.216, 1.522, 1.522, 1.522], af: [57.1, 91.7, 100, 82.9, 82.9, 82.9] }
      }
    },
    "ข้าวโพด": {
      yp: [2.307, 3.203, 2.095, 2.535, 2.535, 2.535],
      ybc: 0.25,
      residuals: {
        "ต้น-ยอด-ใบ": { rpr: [1.299, 1.064, 1.372, 1.245, 1.245, 1.245], af: [100, 100, 100, 100, 100, 100] },
        "ซัง": { rpr: [0.173, 0.151, 0.324, 0.216, 0.216, 0.216], af: [10, 10, 10, 10, 10, 10] },
        "เปลือก": { rpr: [0.186, 0.178, 0.259, 0.208, 0.208, 0.208], af: [10, 10, 10, 10, 10, 10] }
      }
    },
    "อ้อย": {
      yp: [19.490, 20.150, 21.860, 28.780, 20.320, 21.33],
      ybc: 0.2,
      residuals: {
        "ใบ-ยอด": { rpr: [0.180, 0.220, 0.164, 0.101, 0.094, 0.152], af: [41.67, 50, 89.47, 66.67, 66.67, 62.9] },
        "ชานอ้อย": { rpr: [0.279, 0.279, 0.279, 0.279, 0.279, 0.279], af: [0, 0, 0, 0, 0, 0] }
      }
    },
    "มันสำปะหลัง": {
      yp: [10.63, 11.00, 9.82, 10.63, 10.63, 10.21],
      ybc: 0.25,
      residuals: {
        "เหง้า": { rpr: [0.097, 0.141, 0.079, 0.097, 0.097, 0.096], af: [94.45, 88.9, 100, 94.45, 94.45, 94.45] },
        "ลำต้น-ยอด-ใบ": { rpr: [0.250, 0.324, 0.214, 0.250, 0.250, 0.24], af: [24.36, 23.7, 25.01, 24.36, 24.36, 24.36] },
        "กากมันสำปะหลัง": { rpr: [0.333, 0.333, 0.333, 0.333, 0.333, 0.333], af: [100, 100, 100, 100, 100, 100] }
      }
    },
    "ปาล์มน้ำมัน": {
      yp: [0.93, 3.09, 2.01, 1.48, 1.95, 0.72],
      ybc: 0.3,
      residuals: {
        "ลำต้น": { rpr: [16.22, 4.90, 7.54, 10.20, 7.77, 20.89], af: [100, 100, 100, 100, 100, 100] },
        "ทาง-ใบ": { rpr: [0.193, 0.058, 0.09, 0.121, 0.092, 0.248], af: [100, 100, 100, 100, 100, 100] },
        "ทะลาย": { rpr: [0.199, 0.199, 0.199, 0.199, 0.199, 0.199], af: [4.0, 4.0, 4.0, 4.0, 4.0, 4.0] },
        "ใย": { rpr: [0.131, 0.131, 0.131, 0.131, 0.131, 0.131], af: [0, 0, 0, 0, 0, 0] },
        "กะลา": { rpr: [0.056, 0.056, 0.056, 0.056, 0.056, 0.056], af: [0, 0, 0, 0, 0, 0] }
      }
    }
  };

  cropNames.forEach((cropName, cropIndex) => {
    const data = factorData[cropName as keyof typeof factorData];
    regions.forEach((region, regionIndex) => {
      const yp = data.yp[regionIndex];
      Object.entries(data.residuals).forEach(([resName, resData]) => {
        const rpr = resData.rpr[regionIndex];
        const af = resData.af[regionIndex] / 100; // Convert percentage to fraction
        insertFactor.run(cropIndex + 1, region, yp, resName, rpr, af, data.ybc);
      });
    });
  });

  const insertData = db.prepare('INSERT INTO agricultural_data (province_id, crop_id, year, planted_area) VALUES (?, ?, ?, ?)');
  const years = [2022, 2023];
  
  // Generate random data
  for (let year of years) {
    for (let pId = 1; pId <= provinces.length; pId++) {
      for (let cId = 1; cId <= cropNames.length; cId++) {
        // Random area between 10,000 and 500,000 rai
        const area = Math.floor(Math.random() * 490000) + 10000;
        insertData.run(pId, cId, year, area);
      }
    }
  }
}

// API Routes
app.get('/api/dashboard', (req, res) => {
  const year = req.query.year ? parseInt(req.query.year as string) : 2023;
  const cropId = req.query.cropId ? parseInt(req.query.cropId as string) : null;

  let query = `
    SELECT 
      p.name_th as province,
      p.name_en as province_en,
      p.region,
      c.name as crop,
      ad.planted_area,
      MAX(ad.planted_area * cf.yp) as production,
      SUM(ad.planted_area * cf.yp * cf.rpr) as gross_biomass,
      SUM(ad.planted_area * cf.yp * cf.rpr * cf.af) as available_biomass,
      SUM(ad.planted_area * cf.yp * cf.rpr * cf.af * cf.ybc) as biochar_potential
    FROM agricultural_data ad
    JOIN provinces p ON ad.province_id = p.id
    JOIN crops c ON ad.crop_id = c.id
    JOIN crop_factors cf ON c.id = cf.crop_id AND p.region = cf.region
    WHERE ad.year = ?
  `;
  
  const params: any[] = [year];
  
  if (cropId) {
    query += ' AND c.id = ?';
    params.push(cropId);
  }

  query += ' GROUP BY p.id, c.id';

  const data = db.prepare(query).all(params);
  res.json(data);
});

app.get('/api/crops', (req, res) => {
  const crops = db.prepare('SELECT * FROM crops').all();
  res.json(crops);
});

app.get('/api/years', (req, res) => {
  const years = db.prepare('SELECT DISTINCT year FROM agricultural_data ORDER BY year DESC').all();
  res.json(years.map((y: any) => y.year));
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
