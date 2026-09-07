import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import RiskBadge from '../components/common/RiskBadge';
import {
  MapPin,
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  Compass,
  Flame,
  CloudRain,
  Waves,
  Users
} from 'lucide-react';

export default function Villages() {
  const { villages, startFlashFloodSimulation, isDemoMode } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [sortField, setSortField] = useState('floodProbability');
  const [sortAsc, setSortAsc] = useState(false);

  const districts = ['all', 'Chamoli', 'Uttarkashi', 'Rudraprayag', 'Pauri Garhwal'];

  const filteredVillages = villages.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        v.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        v.riverBasin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRisk = riskFilter === 'all' || v.riskLevel === riskFilter;
    const matchDistrict = districtFilter === 'all' || v.district === districtFilter;
    return matchSearch && matchRisk && matchDistrict;
  }).sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    return sortAsc ? valA - valB : valB - valA;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Settlements & Hydrological Vulnerability Registry
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {villages.length} Himalayan Settlements
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete database of river valley settlements across Alaknanda, Bhagirathi, and Mandakini basins.
          </p>
        </div>

        <button
          onClick={() => navigate('/map')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shrink-0"
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>View on Live Risk Map</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search settlement, river basin, district..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Risk Filter */}
        <div className="flex items-center gap-1">
          {['all', 'critical', 'high', 'moderate', 'low'].map(r => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium capitalize transition ${
                riskFilter === r
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* District Filter */}
        <div className="flex items-center gap-1">
          <select
            value={districtFilter}
            onChange={e => setDistrictFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            {districts.map(d => (
              <option key={d} value={d}>
                {d === 'all' ? 'All Districts' : d}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Villages Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Settlement</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">District & Basin</th>
                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('elevation')}>
                  <div className="flex items-center gap-1">
                    <span>Elevation</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('population')}>
                  <div className="flex items-center gap-1">
                    <span>Population</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Current Risk</th>
                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('floodProbability')}>
                  <div className="flex items-center gap-1">
                    <span>Flood Prob.</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Lead Time</th>
                <th className="py-3 px-4">Rain Rate</th>
                <th className="py-3 px-4">Water Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredVillages.map(v => (
                <tr
                  key={v.id}
                  onClick={() => navigate(`/villages/${v.id}`)}
                  className="hover:bg-slate-800/50 cursor-pointer transition group"
                >
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-100 group-hover:text-cyan-300 text-sm">
                      {v.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {v.lat.toFixed(4)}?N, {v.lng.toFixed(4)}?E
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-200">{v.district}</div>
                    <div className="text-[11px] text-slate-400">{v.riverBasin} Basin</div>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300">
                    {v.elevation} m
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300">
                    {v.population?.toLocaleString()}
                  </td>

                  <td className="py-3 px-4">
                    <RiskBadge level={v.riskLevel} size="sm" />
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono font-extrabold text-rose-400 text-sm">
                      {v.floodProbability}%
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-amber-300 font-semibold">
                    {v.leadTime}
                  </td>

                  <td className="py-3 px-4 font-mono text-sky-400">
                    {v.rainfall1h} mm/h
                  </td>

                  <td className="py-3 px-4 font-mono text-blue-400">
                    {v.waterLevel} m
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                      {isDemoMode && (
                        <button
                          onClick={() => startFlashFloodSimulation(v.id)}
                          className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition"
                          title="Simulate flash flood on this settlement"
                        >
                          <Flame className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/villages/${v.id}`)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1 transition"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
