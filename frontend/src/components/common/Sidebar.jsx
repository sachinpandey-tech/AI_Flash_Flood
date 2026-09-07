import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  MapPin,
  Compass,
  TrendingUp,
  Radio,
  AlertTriangle,
  History,
  BarChart3,
  Settings,
  PhoneCall,
  X,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { alerts, villages } = useData();
  const location = useLocation();

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalVillages = villages.filter(v => v.riskLevel === 'critical');

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      to: '/map',
      label: 'Live Risk Map',
      icon: Compass,
      badge: criticalVillages.length > 0 ? `${criticalVillages.length} Crit` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
    },
    { to: '/villages', label: 'Villages Registry', icon: MapPin, count: villages.length },
    { to: '/predictions', label: 'ML Predictions', icon: TrendingUp },
    { to: '/sensors', label: 'Sensor Telemetry', icon: Radio, dot: 'bg-emerald-400' },
    {
      to: '/alerts',
      label: 'Emergency Alerts',
      icon: AlertTriangle,
      badge: activeAlerts.length > 0 ? `${activeAlerts.length}` : null,
      badgeColor: 'bg-rose-600 text-white font-bold'
    },
    { to: '/historical', label: 'Historical & Replay', icon: History },
    { to: '/analytics', label: 'Model Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
    {
      to: '/citizen',
      label: 'Citizen View (Public)',
      icon: PhoneCall,
      highlight: true
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 md:top-16 md:z-30 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 md:hidden">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold">
              HG
            </div>
            <div>
              <div className="font-bold text-sm text-white">HimaGuard</div>
              <div className="text-[10px] text-cyan-400">SIH26192 Command</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Health Pulse Box */}
        <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Telemetry Gateway</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ONLINE
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            28 / 28 IoT Nodes Active across 4 Basins
          </p>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isCitizen = item.to === '/citizen';

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                      : isCitizen
                      ? 'bg-slate-900/60 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
                  }`
                }
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isCitizen ? 'text-cyan-400' : ''
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.dot && (
                    <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                  )}
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {item.count}
                    </span>
                  )}
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>Model Ensemble</span>
            <span className="text-cyan-400 font-mono">XGB-PI-LSTM</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Avg Lead Time</span>
            <span className="text-slate-300 font-mono">84 mins</span>
          </div>
          <div className="pt-1 text-[10px] text-slate-400 text-center">
            Uttarakhand Himalayas ? SIH 2026
          </div>
        </div>
      </aside>
    </>
  );
}
