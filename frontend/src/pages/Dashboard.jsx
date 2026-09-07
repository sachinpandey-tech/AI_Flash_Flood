import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import StatCard from '../components/common/StatCard';
import RiskBadge from '../components/common/RiskBadge';
import LiveRiskMap from '../components/map/LiveRiskMap';
import AlertCard from '../components/alerts/AlertCard';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  Users,
  Compass,
  ArrowUpRight,
  Droplets,
  CloudRain,
  Activity,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
  const {
    villages,
    sensors,
    alerts,
    isDemoMode,
    startFlashFloodSimulation,
    simulation,
    acknowledgeAlert
  } = useData();
  const navigate = useNavigate();

  const criticalVillages = villages.filter(v => v.riskLevel === 'critical');
  const highRiskVillages = villages.filter(v => v.riskLevel === 'high');
  const moderateVillages = villages.filter(v => v.riskLevel === 'moderate');
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const onlineSensors = sensors.filter(s => s.status === 'online');

  const totalPopulation = villages.reduce((acc, curr) => acc + (curr.population || 0), 0);
  const criticalPopulation = criticalVillages.reduce((acc, curr) => acc + (curr.population || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Welcome & Situation Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              Uttarakhand State Command Center
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Synchronized: Just now
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Disaster Operations & Hydro-Risk Overview
          </h1>
          <p className="text-xs text-slate-400">
            Real-time multi-source telemetry from Bhagirathi, Alaknanda, Mandakini & Dhauliganga catchments.
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {isDemoMode && !simulation.isActive && (
            <button
              onClick={() => startFlashFloodSimulation('v-dharali')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-rose-900/40 transition hover:scale-105"
            >
              <Flame className="w-4 h-4 text-amber-200" />
              <span>Simulate Flash Flood</span>
            </button>
          )}

          <button
            onClick={() => navigate('/map')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Fullscreen Risk Map</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (5-Second Rule: Dominant Threat Indicators) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Monitored Settlements"
          value={villages.length}
          subtitle="4 Major Basins"
          icon={Compass}
          variant="default"
          onClick={() => navigate('/villages')}
        />

        <StatCard
          title="Critical Risk"
          value={criticalVillages.length}
          subtitle={criticalVillages.length > 0 ? `${criticalVillages.map(v=>v.name).join(', ')}` : 'Zero critical zones'}
          icon={ShieldAlert}
          variant={criticalVillages.length > 0 ? 'critical' : 'default'}
          badge={criticalVillages.length > 0 ? 'EVACUATE' : null}
          onClick={() => navigate('/map')}
        />

        <StatCard
          title="High Risk"
          value={highRiskVillages.length}
          subtitle="Warning Stage Active"
          icon={AlertTriangle}
          variant={highRiskVillages.length > 0 ? 'high' : 'default'}
          onClick={() => navigate('/map')}
        />

        <StatCard
          title="IoT Sensors Online"
          value={`${onlineSensors.length}/${sensors.length}`}
          subtitle="99.4% Uptime rate"
          icon={Radio}
          variant="info"
          onClick={() => navigate('/sensors')}
        />

        <StatCard
          title="Active Bulletins"
          value={activeAlerts.length}
          subtitle="Disaster Directives"
          icon={AlertTriangle}
          variant={activeAlerts.length > 0 ? 'critical' : 'default'}
          onClick={() => navigate('/alerts')}
        />

        <StatCard
          title="Catchment Population"
          value={totalPopulation.toLocaleString()}
          subtitle={`${criticalPopulation.toLocaleString()} in critical zones`}
          icon={Users}
          variant="default"
        />
      </div>

      {/* Main Split: Interactive Risk Map & Live Vulnerability Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Centerpiece Map View */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-100">Hyperlocal Live Risk Map</h2>
              <span className="text-[10px] text-slate-400 font-mono">Center: Chamoli / Garhwal</span>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>Expand Layer Controls</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <LiveRiskMap height="460px" compact={false} />
        </div>

        {/* Right Column: High Risk Settlements & Quick Status */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Priority Risk Settlements
                </h3>
              </div>
              <button
                onClick={() => navigate('/villages')}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                View all ({villages.length})
              </button>
            </div>

            {/* List of top vulnerable villages */}
            <div className="mt-3 space-y-2.5 max-h-[390px] overflow-y-auto pr-1">
              {villages
                .slice()
                .sort((a, b) => b.floodProbability - a.floodProbability)
                .slice(0, 6)
                .map(village => (
                  <div
                    key={village.id}
                    onClick={() => navigate(`/villages/${village.id}`)}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                          {village.name}
                        </span>
                        <RiskBadge level={village.riskLevel} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-mono">
                        <span>?? {village.rainfall1h} mm/h</span>
                        <span>?? {village.soilMoisture}%</span>
                        <span>?? {village.waterLevel}m</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-rose-400 font-mono">
                        {village.floodProbability}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {village.leadTime}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Emergency Bulletins Stream */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Live Incident Bulletins & Warnings</h3>
              <p className="text-xs text-slate-400">
                Active alerts automatically synchronized across siren relays, SMS gateways & DEOC consoles.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/alerts')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Alert Operations Room</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.slice(0, 2).map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={acknowledgeAlert}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
