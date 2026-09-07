import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Radio,
  RotateCcw,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export default function Settings() {
  const { currentUser, roles, switchRole } = useAuth();
  const { isDemoMode, toggleDemoMode, stopSimulation } = useData();

  const [pollingRate, setPollingRate] = useState(15);
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [sirenSync, setSirenSync] = useState(true);
  const [smsSync, setSmsSync] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Control Center Preferences & Configuration
            </h1>
            <p className="text-xs text-slate-400">
              Customize operator role telemetry, notification broadcast gateways, and simulation speed.
            </p>
          </div>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      {/* Operator Role & Identity */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Operator Identity & Authorization
            </h2>
          </div>
          <span className="text-xs text-cyan-400 font-mono">Role: {currentUser?.badge}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Official Name / Title</label>
            <input
              type="text"
              readOnly
              value={currentUser?.roleName || 'Commander'}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Station Email</label>
            <input
              type="text"
              readOnly
              value={currentUser?.email || ''}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono"
            />
          </div>
        </div>

        {/* Quick Role Switcher */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-300 mb-2">
            Switch Mock Role:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {roles.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => switchRole(r.id)}
                className={`p-3 rounded-xl border text-left text-xs transition ${
                  currentUser?.role === r.id
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold">{r.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{r.badge}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Gateways & Notification Preferences */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Bell className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Broadcast Telemetry & Audio Dispatch
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <div>
              <div className="font-bold text-slate-200">Acoustic Siren Telemetry Relay</div>
              <p className="text-[11px] text-slate-400">Trigger valley civil defence sirens when risk level reaches Critical (&gt;80%)</p>
            </div>
            <input
              type="checkbox"
              checked={sirenSync}
              onChange={e => setSirenSync(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <div>
              <div className="font-bold text-slate-200">Public Cell Broadcast (SMS Gateway)</div>
              <p className="text-[11px] text-slate-400">Simulate broadcasting SMS alerts to all citizen cell phones in target geo-fence</p>
            </div>
            <input
              type="checkbox"
              checked={smsSync}
              onChange={e => setSmsSync(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
            <div>
              <div className="font-bold text-slate-200">Emergency Audio Chime</div>
              <p className="text-[11px] text-slate-400">Play alert tone in browser console when new critical warning is issued</p>
            </div>
            <input
              type="checkbox"
              checked={audioAlerts}
              onChange={e => setAudioAlerts(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 h-4 w-4"
            />
          </label>
        </div>
      </div>

      {/* Simulation Engine & Operational Mode */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Simulation Engine Controls
            </h2>
          </div>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
            isDemoMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {isDemoMode ? 'DEMO MODE ACTIVE' : 'LIVE TELEMETRY MODE'}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-bold text-slate-200">Operational Mode Toggle</div>
              <p className="text-[11px] text-slate-400">Switch between live monitoring and synthetic cloudburst demo sequences</p>
            </div>
            <button
              onClick={toggleDemoMode}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                isDemoMode
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              Switch to {isDemoMode ? 'LIVE MODE' : 'DEMO MODE'}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">IoT Telemetry Polling Rate:</span>
              <span className="font-mono text-cyan-400 font-bold">{pollingRate} seconds</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={pollingRate}
              onChange={e => setPollingRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5s (Rapid Demo)</span>
              <span>15s (Standard)</span>
              <span>60s (Field Eco-mode)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-rose-400">Reset All Simulation Overrides</div>
              <p className="text-[11px] text-slate-400">Revert Dharali and all sensor streams back to peaceful normal baseline</p>
            </div>
            <button
              onClick={stopSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 text-xs font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Baseline</span>
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/30 transition"
          >
            Save Preferences
          </button>
        </div>

      </div>

    </div>
  );
}
