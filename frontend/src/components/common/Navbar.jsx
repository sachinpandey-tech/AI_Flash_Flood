import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  ShieldAlert,
  CloudLightning,
  Bell,
  Radio,
  UserCheck,
  ChevronDown,
  LogOut,
  ExternalLink,
  Flame,
  Activity,
  Layers
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { currentUser, roles, switchRole, logout } = useAuth();
  const { isDemoMode, toggleDemoMode, startFlashFloodSimulation, simulation, alerts } = useData();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const navigate = useNavigate();

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalCount = activeAlerts.filter(a => a.severity === 'critical').length;

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6">
      <div className="flex h-full items-center justify-between gap-3">
        
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 md:hidden focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <Layers className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white font-mono">HimaGuard</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  SIH26192
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide">
                Hyperlocal Flash Flood Early Warning & Response
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Live/Demo Mode & Simulate Flash Flood (The Centerpiece Trigger) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live / Demo Mode Toggle Switch */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-1 shadow-inner">
            <button
              onClick={() => isDemoMode && toggleDemoMode()}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
                !isDemoMode
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className={`w-3 h-3 ${!isDemoMode ? 'animate-pulse text-emerald-200' : ''}`} />
              <span className="hidden xs:inline">LIVE</span>
            </button>
            <button
              onClick={() => !isDemoMode && toggleDemoMode()}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full transition-all ${
                isDemoMode
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>DEMO</span>
            </button>
          </div>

          {/* Simulate Flash Flood Trigger Button (Demo Mode Dependent) */}
          {isDemoMode && (
            <button
              onClick={() => startFlashFloodSimulation('v-dharali')}
              disabled={simulation.isActive}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                simulation.isActive
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white border border-rose-500/40 hover:scale-105 shadow-rose-900/30 active:scale-95'
              }`}
            >
              <CloudLightning className={`w-4 h-4 ${simulation.isActive ? 'animate-bounce text-rose-400' : 'text-amber-200'}`} />
              <span className="hidden sm:inline">
                {simulation.isActive ? 'Simulation Running...' : 'Simulate Flash Flood'}
              </span>
              <span className="sm:hidden">Simulate</span>
              {simulation.isActive && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
              )}
            </button>
          )}

          {/* Citizen Emergency View Direct Shortcut */}
          <Link
            to="/citizen"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Citizen View</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        </div>

        {/* Right: Notifications & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Active Alerts Bell */}
          <Link
            to="/alerts"
            className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
            title="Active Emergency Bulletins"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className={`absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${
                criticalCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-600'
              }`}>
                {activeAlerts.length}
              </span>
            )}
          </Link>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(prev => !prev)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition"
            >
              <div className="h-6 w-6 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-[11px]">
                {currentUser?.badge ? currentUser.badge.substring(0, 2).toUpperCase() : 'OP'}
              </div>
              <div className="hidden xl:block text-left">
                <div className="font-semibold text-slate-200 truncate max-w-[140px]">{currentUser?.roleName || 'Operator'}</div>
                <div className="text-[10px] text-slate-400">{currentUser?.badge || 'Officer'}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-800 text-xs">
                  <p className="text-slate-400">Signed in as</p>
                  <p className="font-semibold text-slate-200 truncate">{currentUser?.email}</p>
                  <p className="text-[10px] text-cyan-400 mt-0.5">{currentUser?.badge}</p>
                </div>

                <div className="py-1">
                  <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Mock Demo Role
                  </p>
                  {roles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchRole(r.id);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                        currentUser?.role === r.id
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div>{r.name}</div>
                        <div className="text-[10px] text-slate-400">{r.badge}</div>
                      </div>
                      {currentUser?.role === r.id && (
                        <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      logout();
                      setShowRoleDropdown(false);
                      navigate('/login');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out / Switch User
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
