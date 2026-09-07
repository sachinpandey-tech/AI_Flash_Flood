import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import RiskBadge from '../components/common/RiskBadge';
import { EVACUATION_SHELTERS } from '../services/mockData';
import {
  MapPin,
  Compass,
  ArrowLeft,
  CloudRain,
  Droplets,
  Waves,
  Mountain,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Home,
  Users,
  TrendingUp,
  Clock,
  Flame,
  Radio,
  ExternalLink
} from 'lucide-react';

export default function VillageDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { villages, startFlashFloodSimulation, isDemoMode, simulation } = useData();

  // Find village or fallback to Dharali
  const village = villages.find(v => v.id === id) || villages[0];

  // Associated shelters
  const shelters = EVACUATION_SHELTERS.filter(
    s => s.villageId === village.id || s.villageName.toLowerCase().includes(village.name.toLowerCase())
  );

  // Associated sensors
  const villageSensors = village.sensors || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {village.name} Hydrological Profile
              </h1>
              <RiskBadge level={village.riskLevel} size="md" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>{village.district} District</span>
              <span>?</span>
              <span>{village.riverBasin} Catchment Basin</span>
              <span>?</span>
              <span>Elevation: {village.elevation}m ASL</span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {isDemoMode && (
            <button
              onClick={() => startFlashFloodSimulation(village.id)}
              disabled={simulation.isActive && simulation.targetVillageId === village.id}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 text-white text-xs font-bold shadow-lg transition"
            >
              <Flame className="w-4 h-4" />
              <span>Simulate Surge Here</span>
            </button>
          )}

          <button
            onClick={() => navigate('/predictions')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition"
          >
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>View Hydrograph</span>
          </button>

          <button
            onClick={() => navigate('/map')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Locate on Map</span>
          </button>
        </div>
      </div>

      {/* Dominant Threat Card (5-Second Rule) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flood Probability</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-400 font-mono">{village.floodProbability}%</span>
            <span className="text-xs text-slate-400">Ensemble score</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {village.floodProbability > 80 ? 'CRITICAL EVACUATION THRESHOLD' : village.floodProbability > 60 ? 'HIGH WARNING' : 'WITHIN BUFFER'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Safe Lead Time</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-300 font-mono">{village.leadTime}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Until peak flood surge arrives at river bridge
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resident Population</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-100 font-mono">{village.population?.toLocaleString()}</span>
            <span className="text-xs text-slate-400">residents</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {village.vulnerableWards?.length || 2} vulnerable riverfront wards
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">River Discharge</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-400 font-mono">{village.dischargeRate || 65}</span>
            <span className="text-xs text-slate-400">m?/s</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Water level: <span className="text-slate-200 font-bold">{village.waterLevel} m</span> ({village.waterLevelTrend})
          </p>
        </div>

      </div>

      {/* Two-Column Grid: 5-Factor Risk Breakdown vs Explainability Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 5 Multi-Factor Risk Breakdown Bars */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
            <h3 className="text-sm font-bold text-slate-100 mb-1">
              Multi-Source Risk Factor Decomposition
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time calibration against hydrological thresholds and slope runoff coefficients.
            </p>

            <div className="space-y-4">
              
              {/* Factor 1: Rainfall */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                    1-Hour Precipitation Intensity
                  </span>
                  <span className="font-mono font-bold text-sky-300">
                    {village.rainfall1h} mm/h <span className="text-slate-400 font-normal">(FFG: 45)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      village.rainfall1h > 70 ? 'bg-rose-500' : village.rainfall1h > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (village.rainfall1h / 120) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0 mm/h (Dry)</span>
                  <span>45 mm/h (Warning Threshold)</span>
                  <span>120 mm/h (Cloudburst)</span>
                </div>
              </div>

              {/* Factor 2: Soil Saturation */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <Droplets className="w-3.5 h-3.5 text-amber-400" />
                    Topsoil Saturation Index (TDR Array)
                  </span>
                  <span className="font-mono font-bold text-amber-300">
                    {village.soilMoisture}% <span className="text-slate-400 font-normal">(Limit: 85%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      village.soilMoisture > 85 ? 'bg-rose-500' : village.soilMoisture > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${village.soilMoisture}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0% (Permeable)</span>
                  <span>70% (Field Capacity)</span>
                  <span>100% (Runoff Excess)</span>
                </div>
              </div>

              {/* Factor 3: River Water Level */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <Waves className="w-3.5 h-3.5 text-blue-400" />
                    River Channel Gauge Level
                  </span>
                  <span className="font-mono font-bold text-blue-300">
                    {village.waterLevel} m <span className="text-slate-400 font-normal">(Danger: 3.0m)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      village.waterLevel > 2.8 ? 'bg-rose-500' : village.waterLevel > 2.0 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (village.waterLevel / 4.0) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0.5m (Normal)</span>
                  <span>2.2m (Warning)</span>
                  <span>3.2m (High Inundation)</span>
                </div>
              </div>

              {/* Factor 4: Slope Angle */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <Mountain className="w-3.5 h-3.5 text-purple-400" />
                    Catchment Slope Angle (Funnel Hazard)
                  </span>
                  <span className="font-mono font-bold text-purple-300">
                    {village.slopeAngle || 34}? incline
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${((village.slopeAngle || 34) / 50) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>10? (Gentle)</span>
                  <span>30? (Rapid Debris Flow)</span>
                  <span>50? (Sheer Cliff)</span>
                </div>
              </div>

              {/* Factor 5: Historical Flood Vulnerability */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                    Historical Debris & Moraine Risk Index
                  </span>
                  <span className="font-mono font-bold text-orange-300">
                    {village.riskLevel === 'critical' ? 'High Hazard (0.91)' : 'Moderate (0.64)'}
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-orange-500 transition-all duration-500"
                    style={{ width: village.riskLevel === 'critical' ? '91%' : '64%' }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right: Explainability Engine ("Why is the Risk High / Low?") */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  Plain-Language Diagnostic Checklist
                </h3>
                <p className="text-xs text-slate-400">
                  "Why is the risk level {village.riskLevel?.toUpperCase()}?"
                </p>
              </div>
              <RiskBadge level={village.riskLevel} size="sm" />
            </div>

            {/* Checklist Items */}
            <div className="mt-4 space-y-3">
              {village.whyFactors?.map((wf, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition ${
                    wf.status === 'hazard'
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : wf.status === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {wf.status === 'hazard' ? (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    ) : wf.status === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${
                      wf.status === 'hazard' ? 'text-rose-300' : wf.status === 'warning' ? 'text-amber-300' : 'text-slate-200'
                    }`}>
                      {wf.factor}
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {wf.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vulnerable Wards Box */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Immediate Danger Zones & Wards</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {village.vulnerableWards?.map((ward, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                    ?? {ward}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Designated Evacuation Shelters Section */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Designated Evacuation Shelters & Relief Hubs</h3>
              <p className="text-xs text-slate-400">High-ground safe staging areas verified above flood inundation lines.</p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {shelters.length} Designated Relocation Camps
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {shelters.length > 0 ? (
            shelters.map(sh => (
              <div key={sh.id} className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{sh.name}</h4>
                    <p className="text-[11px] text-slate-400">Elevation: {sh.elevation}m ? {sh.roadAccess}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    SAFE ZONE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px]">Capacity:</span>
                    <div className="font-semibold text-slate-200">{sh.capacity} persons</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Current Occupancy:</span>
                    <div className="font-semibold text-purple-300">{sh.currentOccupancy} / {sh.capacity}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-[10px] text-slate-400 block">Recommended Safe Access Route:</span>
                  <span className="font-medium text-cyan-300">{sh.safeRoute}</span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Camp Officer: {sh.contact}</span>
                  <span className="font-mono text-slate-300">{sh.phone}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
              Designated regional staging facility: GMVN Guest House & Tehsil Community Center.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
