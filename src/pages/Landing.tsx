import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Map, BarChart3, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function Landing() {
  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 h-full w-full" aria-hidden="true">
          <div className="relative h-full">
            <svg
              className="absolute right-full transform translate-y-1/3 translate-x-1/4 md:translate-y-1/2 sm:translate-x-1/2 lg:translate-x-full"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect x={0} y={0} width={4} height={4} className="text-stone-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={404} height={784} fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)" />
            </svg>
            <svg
              className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="d2a68204-c383-44b1-b99f-42ccff4e5365"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect x={0} y={0} width={4} height={4} className="text-stone-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width={404} height={784} fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)" />
            </svg>
          </div>
        </div>

        <div className="relative pt-16 pb-16 sm:pb-24 lg:pb-32">
          <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6 lg:mt-32">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
              >
                <h1>
                  <span className="block text-sm font-semibold uppercase tracking-wide text-emerald-600 sm:text-base lg:text-sm xl:text-base">
                    Thailand Biochar Potential
                  </span>
                  <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                    <span className="block text-stone-900">Turning Agricultural</span>
                    <span className="block text-emerald-600">Waste into Value</span>
                  </span>
                </h1>
                <p className="mt-3 text-base text-stone-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Explore the potential of producing Biochar from agricultural residues across Thailand. 
                  Our interactive dashboard visualizes biomass availability, crop yields, and carbon sequestration potential.
                </p>
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
                  >
                    Explore Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
              >
                <div className="relative mx-auto w-full rounded-2xl shadow-2xl lg:max-w-md overflow-hidden bg-white ring-1 ring-stone-200">
                  <div className="p-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6">
                      <Leaf className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-4">Why Biochar?</h3>
                    <ul className="space-y-4 text-stone-600">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                          <span className="text-emerald-600 text-sm font-bold">1</span>
                        </div>
                        <p className="ml-3">Reduces agricultural waste burning and PM2.5</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                          <span className="text-emerald-600 text-sm font-bold">2</span>
                        </div>
                        <p className="ml-3">Improves soil health and water retention</p>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                          <span className="text-emerald-600 text-sm font-bold">3</span>
                        </div>
                        <p className="ml-3">Sequesters carbon for hundreds of years</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-emerald-600 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-stone-900 sm:text-4xl">
              Comprehensive Data Visualization
            </p>
            <p className="mt-4 max-w-2xl text-xl text-stone-500 mx-auto">
              Everything you need to understand the biochar landscape in Thailand.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-stone-50 rounded-2xl px-6 pb-8 h-full ring-1 ring-stone-200">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-emerald-500 rounded-xl shadow-lg">
                        <Map className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-stone-900 tracking-tight">Interactive Maps</h3>
                    <p className="mt-5 text-base text-stone-500">
                      Visualize data across provinces with interactive choropleth maps. Drill down to see regional differences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-stone-50 rounded-2xl px-6 pb-8 h-full ring-1 ring-stone-200">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-emerald-500 rounded-xl shadow-lg">
                        <BarChart3 className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-stone-900 tracking-tight">Detailed Analytics</h3>
                    <p className="mt-5 text-base text-stone-500">
                      Break down data by crop type, year, and region using intuitive charts and graphs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-stone-50 rounded-2xl px-6 pb-8 h-full ring-1 ring-stone-200">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-emerald-500 rounded-xl shadow-lg">
                        <Globe className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-stone-900 tracking-tight">Carbon Impact</h3>
                    <p className="mt-5 text-base text-stone-500">
                      Calculate the potential carbon sequestration based on available agricultural residues.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
