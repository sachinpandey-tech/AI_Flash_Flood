import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { getPredictions } from '../services/api';
import RiskBadge from '../components/common/RiskBadge';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  BrainCircuit,
  CloudRain,
  Droplets,
  Waves,
  Activity,
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react';

export default function Predictions() {
  const { villages } = useData();
  const [selectedVillageId, setSelectedVillageId] = useState(villages[0]?.id || 'v-dharali');
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);

  const selectedVillage = villages.find(v => v.id === selectedVillageId) || villages[0];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getPredictions(selectedVillageId).then(data => {
      if (isMounted) {
        setPredictionData(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [selectedVillageId, selectedVillage.rainfall1h, selectedVillage.waterLevel]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Settlement Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              ML Hydrological Forecast & Lead Time
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
              XGBoost + PI-LSTM Ensemble
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multi-horizon hydrograph projection blending automated rain gauges, TDR soil sensors, and hydrodynamic river radars.
          </p>
        </div>

        {/* Settlement Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold shrink-0">Target Settlement:</label>
          <select
            value={selectedVillageId}
            onChange={e => setSelectedVillageId(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
          >
            {villages.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.riskLevel.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Model Diagnostic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flood Probability</span>
            <RiskBadge level={selectedVillage.riskLevel} size="sm" />
          </div>
          <div className="mt-2 text-3xl font-black text-rose-400 font-mono">
            {selectedVillage.floodProbability}%
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Probability of channel breach within lead time window
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Safe Lead Time</span>
          <div className="mt-2 text-3xl font-black text-amber-300 font-mono">
            {selectedVillage.leadTime}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Advance warning buffer for community evacuation
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Model Confidence Score</span>
          <div className="mt-2 text-3xl font-black text-cyan-400 font-mono">
            {predictionData?.confidenceScore || 89.4}%
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Derived from 4 corroborating sensor modalities
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catchment Basin</span>
          <div className="mt-2 text-xl font-black text-slate-200 truncate">
            {selectedVillage.riverBasin}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Elev: {selectedVillage.elevation}m ? Incline: {selectedVillage.slopeAngle}?
          </p>
        </div>

      </div>

      {/* Hydrograph Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Predicted vs Observed River Water Level */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Waves className="w-4 h-4 text-blue-400" />
                <span>River Stage Hydrograph (Predicted vs. Observed Level)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Water level progression with 3-hour forward predictive projection.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">Danger Mark: 3.0 m</span>
          </div>

          <div className="h-72 w-full pt-4">
            {predictionData && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictionData.timeSeries}>
                  <defs>
                    <linearGradient id="predColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" textAnchor="middle" fontSize={11} />
                  <YAxis domain={[0, 4.0]} stroke="#64748b" fontSize={11} unit="m" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="predWater" name="Predicted Water Level (m)" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#predColor)" />
                  <Line type="monotone" dataKey="observedWater" name="Observed Gauge (m)" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4 }} connectNulls={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Flood Probability Curve */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              <span>Probability Trend (%)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Machine learning risk probability trajectory.
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            {predictionData && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionData.timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="prob" name="Risk Probability %" stroke="#f43f5e" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 3: Rainfall Intensity Bar Graph */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-sky-400" />
              <span>Precipitation Hyetograph (mm/h)</span>
            </h3>
            <span className="text-xs text-amber-400 font-mono">FFG Threshold: 45 mm/h</span>
          </div>

          <div className="h-64 w-full pt-2">
            {predictionData && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictionData.timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} unit="mm" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                  <Bar dataKey="rain" name="Rainfall (mm/h)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 4: Soil Saturation Curve */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-amber-400" />
              <span>Topsoil Saturation Curve (TDR %)</span>
            </h3>
            <span className="text-xs text-rose-400 font-mono">Runoff Limit: 85%</span>
          </div>

          <div className="h-64 w-full pt-2">
            {predictionData && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictionData.timeSeries}>
                  <defs>
                    <linearGradient id="soilColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[40, 100]} stroke="#64748b" fontSize={11} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="soil" name="Soil Moisture %" stroke="#eab308" strokeWidth={2.5} fillOpacity={1} fill="url(#soilColor)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
