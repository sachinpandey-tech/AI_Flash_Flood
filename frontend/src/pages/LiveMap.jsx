import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import LiveRiskMap from '../components/map/LiveRiskMap';
import RiskBadge from '../components/common/RiskBadge';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Filter,
  Layers,
  ChevronRight,
  Flame,
  CloudLightning,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function LiveMap() {
  const { villages, isDemoMode, startFlashFloodSimulation, simulation } = useData();
  const navigate = useNavigate();

  const [filterDistrict, setFilterDistrict] = useState('all');

  const districts = ['all', 'Chamoli', 'Uttarkashi', 'Rudraprayag', 'Pauri Garhwal'];

  const filteredVillages = villages.filter(v => {
    return filterDistrict === 'all' || v.district === filterDistrict;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-bold text-white">Interactive Hydro-Risk GIS Map</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              Leaflet / CartoDB Dark Matter
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any village marker or sensor pin to inspect real-time hydrological telemetry and risk diagnostic factor bars.
          </p>
        </div>

        {/* Quick Flash Flood Trigger */}
        {isDemoMode && !simulation.isActive && (
          <button
            onClick={() => startFlashFloodSimulation('v-dharali')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-rose-900/30 transition shrink-0"
          >
            <Flame className="w-4 h-4 text-amber-200" />
            <span>Simulate Flash Flood (Dharali)</span>
          </button>
        )}
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Map View */}
        <div className="lg:col-span-9">
          <LiveRiskMap height="680px" compact={false} />
        </div>

        {/* Right Settlement Quick Selector */}
        <div className="lg:col-span-3 space-y-3">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col h-[680px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Settlements Index ({filteredVillages.length})
              </h3>
            </div>

            {/* District Filter Chips */}
            <div className="py-2 flex items-center gap-1 overflow-x-auto">
              {districts.map(d => (
                <button
                  key={d}
                  onClick={() => setFilterDistrict(d)}
                  className={`px-2 py-1 rounded text-[11px] font-medium shrink-0 transition ${
                    filterDistrict === d
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 mt-1">
              {filteredVillages
                .slice()
                .sort((a, b) => b.floodProbability - a.floodProbability)
                .map(v => (
                  <div
                    key={v.id}
                    onClick={() => navigate(`/villages/${v.id}`)}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                        {v.name}
                      </span>
                      <RiskBadge level={v.riskLevel} size="sm" />
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                      <span>{v.riverBasin}</span>
                      <span className="font-mono text-rose-400 font-bold">{v.floodProbability}% prob</span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>?? {v.rainfall1h}mm/h</span>
                      <span>?? {v.waterLevel}m</span>
                      <span>? {v.leadTime}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Note box */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>Clicking any settlement navigates to its physical risk factor decomposition & checklist.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
