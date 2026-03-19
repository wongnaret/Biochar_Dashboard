import { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import { motion } from 'motion/react';
import { Filter, Download, Map as MapIcon, BarChart2, PieChart as PieChartIcon, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

// A public GeoJSON for Thailand provinces
const geoUrl = "https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json";

interface Crop {
  id: number;
  name: string;
  yp: number;
  rpr: number;
  af: number;
  ybc: number;
}

interface DashboardData {
  province: string;
  province_en: string;
  region: string;
  crop: string;
  planted_area: number;
  production: number;
  gross_biomass: number;
  available_biomass: number;
  biochar_potential: number;
}

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [years, setYears] = useState<number[]>([]);
  
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedCrop, setSelectedCrop] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/crops')
      .then(res => res.json())
      .then(setCrops);
    fetch('/api/years')
      .then(res => res.json())
      .then(data => {
        setYears(data);
        if (data.length > 0) setSelectedYear(data[0]);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = new URL('/api/dashboard', window.location.origin);
    url.searchParams.append('year', selectedYear.toString());
    if (selectedCrop !== 'all') {
      url.searchParams.append('cropId', selectedCrop.toString());
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [selectedYear, selectedCrop]);

  // Aggregated data for charts
  const aggregatedByCrop = useMemo(() => {
    const agg: Record<string, any> = {};
    data.forEach(d => {
      if (!agg[d.crop]) {
        agg[d.crop] = { name: d.crop, biochar_potential: 0, available_biomass: 0 };
      }
      agg[d.crop].biochar_potential += d.biochar_potential;
      agg[d.crop].available_biomass += d.available_biomass;
    });
    return Object.values(agg).sort((a, b) => b.biochar_potential - a.biochar_potential);
  }, [data]);

  const aggregatedByProvince = useMemo(() => {
    const agg: Record<string, any> = {};
    data.forEach(d => {
      if (!agg[d.province_en]) {
        agg[d.province_en] = { name: d.province_en, name_th: d.province, biochar_potential: 0 };
      }
      agg[d.province_en].biochar_potential += d.biochar_potential;
    });
    return Object.values(agg).sort((a, b) => b.biochar_potential - a.biochar_potential);
  }, [data]);

  const totalBiochar = useMemo(() => {
    return data.reduce((sum, d) => sum + d.biochar_potential, 0);
  }, [data]);

  const totalBiomass = useMemo(() => {
    return data.reduce((sum, d) => sum + d.available_biomass, 0);
  }, [data]);

  // Color scale for map
  const colorScale = scaleQuantize<string>()
    .domain([0, Math.max(...aggregatedByProvince.map(d => d.biochar_potential)) || 1])
    .range(['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857']);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Biochar Potential Dashboard</h1>
          <p className="mt-1 text-sm text-stone-500">
            Analyze agricultural residues and biochar production capacity across Thailand.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-stone-200">
            <Filter className="h-4 w-4 text-stone-400" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent border-none text-sm font-medium text-stone-700 focus:ring-0 cursor-pointer"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-stone-200">
            <Filter className="h-4 w-4 text-stone-400" />
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-transparent border-none text-sm font-medium text-stone-700 focus:ring-0 cursor-pointer"
            >
              <option value="all">All Crops</option>
              {crops.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">Total Biochar Potential</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-emerald-600">
                  {(totalBiochar / 1000000).toFixed(2)}
                </span>
                <span className="text-sm font-medium text-stone-500">Million Tons</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">Available Biomass</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-stone-900">
                  {(totalBiomass / 1000000).toFixed(2)}
                </span>
                <span className="text-sm font-medium text-stone-500">Million Tons</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">Conversion Efficiency</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-stone-900">
                  {totalBiomass ? ((totalBiochar / totalBiomass) * 100).toFixed(1) : 0}
                </span>
                <span className="text-sm font-medium text-stone-500">% avg yield</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Section */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <MapIcon className="h-5 w-5 text-emerald-500" />
                  Biochar Potential by Province
                </h2>
              </div>
              <div className="h-[500px] w-full bg-stone-50 rounded-xl overflow-hidden relative">
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 2000,
                    center: [100.5, 13.5] // Center of Thailand
                  }}
                  className="w-full h-full"
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        // Match geography name with our data
                        // The GeoJSON might have different naming conventions, we try our best
                        const provinceNameEn = geo.properties.name || geo.properties.NAME_1;
                        const d = aggregatedByProvince.find(p => 
                          p.name.toLowerCase().includes(provinceNameEn?.toLowerCase()) || 
                          provinceNameEn?.toLowerCase().includes(p.name.toLowerCase())
                        );
                        
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={d ? colorScale(d.biochar_potential) : "#f5f5f4"}
                            stroke="#e7e5e4"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "#10b981", outline: "none", cursor: "pointer" },
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-sm border border-stone-200 text-xs">
                  <div className="font-medium mb-2">Potential (Tons)</div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-[#ecfdf5]"></div>
                    <div className="w-4 h-4 bg-[#a7f3d0]"></div>
                    <div className="w-4 h-4 bg-[#34d399]"></div>
                    <div className="w-4 h-4 bg-[#059669]"></div>
                    <div className="w-4 h-4 bg-[#047857]"></div>
                  </div>
                  <div className="flex justify-between mt-1 text-stone-500">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-6">
                  <PieChartIcon className="h-5 w-5 text-emerald-500" />
                  Potential by Crop
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={aggregatedByCrop}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="biochar_potential"
                      >
                        {aggregatedByCrop.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number) => [value.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' Tons', 'Biochar Potential']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-6">
              <BarChart2 className="h-5 w-5 text-emerald-500" />
              Biomass to Biochar Conversion by Crop
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={aggregatedByCrop}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#57534e' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#57534e' }} tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f5f5f4' }}
                    formatter={(value: number, name: string) => [
                      value.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' Tons', 
                      name === 'biochar_potential' ? 'Biochar Potential' : 'Available Biomass'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="available_biomass" name="Available Biomass" fill="#a7f3d0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="biochar_potential" name="Biochar Potential" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
