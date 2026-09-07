import React, { useState, useEffect } from 'react';
import { getModelAnalytics } from '../services/api';
import {
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Clock,
  ShieldCheck,
  Radio,
  Layers,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getModelAnalytics().then(setAnalytics);
  }, []);

  const hydrographData = [
    { hour: '00:00', actual: 42, predicted: 40 },
    { hour: '04:00', actual: 48, predicted: 50 },
    { hour: '08:00', actual: 85, predicted: 82 },
    { hour: '12:00', actual: 190, predicted: 185 },
    { hour: '14:00', actual: 340, predicted: 355 },
    { hour: '16:00', actual: 410, predicted: 395 },
    { hour: '18:00', actual: 290, predicted: 305 },
    { hour: '20:00', actual: 160, predicted: 155 },
    { hour: '23:59', actual: 95, predicted: 90 }
  ];

  const basinRainfall = [
    { basin: 'Bhagirathi', rain24h: 142, alertThreshold: 110 },
    { basin: 'Alaknanda', rain24h: 168, alertThreshold: 120 },
    { basin: 'Mandakini', rain24h: 185, alertThreshold: 115 },
    { basin: 'Dhauliganga', rain24h: 94, alertThreshold: 90 }
  ];

  const latencyData = [
    { day: 'Mon', responseMins: 4.8 },
    { day: 'Tue', responseMins: 4.2 },
    { day: 'Wed', responseMins: 3.9 },
    { day: 'Thu', responseMins: 4.5 },
    { day: 'Fri', responseMins: 3.6 },
    { day: 'Sat', responseMins: 4.1 },
    { day: 'Sun', responseMins: 3.8 }
  ];

  const COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Machine Learning Benchmarks & System Analytics
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
              ILLUSTRATIVE DEMO BENCHMARKS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ensemble model validation against synthetic Himalayan hydro-meteorological test splits.
          </p>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>K-Fold Cross-Validation (K=5)</span>
        </div>
      </div>

      {/* Model Performance Cards (Clearly Labeled Demo Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accuracy</span>
          <div className="mt-2 text-2xl lg:text-3xl font-black text-cyan-400 font-mono">
            {analytics?.metrics?.accuracy || 92.4}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Overall binary classification</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Precision</span>
          <div className="mt-2 text-2xl lg:text-3xl font-black text-emerald-400 font-mono">
            {analytics?.metrics?.precision || 89.1}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Low false-alarm rate</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recall (Sensitivity)</span>
          <div className="mt-2 text-2xl lg:text-3xl font-black text-amber-400 font-mono">
            {analytics?.metrics?.recall || 94.2}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Zero missed flash flood surges</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">F1-Score</span>
          <div className="mt-2 text-2xl lg:text-3xl font-black text-purple-400 font-mono">
            {analytics?.metrics?.f1Score || 91.6}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Harmonic mean balance</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ROC-AUC</span>
          <div className="mt-2 text-2xl lg:text-3xl font-black text-rose-400 font-mono">
            {analytics?.metrics?.rocAuc || 0.948}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Discriminative separability</p>
        </div>

      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Predicted vs Actual Hydrograph */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>Model Calibration: Predicted vs. Actual Hydrograph (m?/s)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Comparison of ML discharge prediction against physical gauging station records.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">R? = 0.962</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hydrographData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit=" m?/s" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="actual" name="Actual Discharge (m?/s)" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="predicted" name="ML Predicted Surge (m?/s)" stroke="#f43f5e" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Village Risk Distribution Pie */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Current Risk Distribution</span>
            </h3>
            <p className="text-xs text-slate-400">14 Monitored settlements by threat tier.</p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            {analytics && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {analytics.riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 3: 24h Rainfall Accumulation by Basin */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Catchment Precipitation Accumulation (24h)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">mm rain</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={basinRainfall}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="basin" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit=" mm" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="rain24h" name="24h Rainfall (mm)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="alertThreshold" name="Catchment Alert Limit" fill="#eab308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Alert Response Time */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Operator Alert Dispatch Latency (Minutes)</span>
            </h3>
            <span className="text-xs text-emerald-400 font-mono">Avg: 4.1 mins</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 8]} stroke="#64748b" fontSize={11} unit="m" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Line type="monotone" dataKey="responseMins" name="Mean Dispatch Latency (min)" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
