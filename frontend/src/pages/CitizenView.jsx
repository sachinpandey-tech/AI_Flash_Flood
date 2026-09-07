import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { EVACUATION_SHELTERS } from '../services/mockData';
import RiskBadge from '../components/common/RiskBadge';
import {
  PhoneCall,
  ShieldAlert,
  MapPin,
  Clock,
  Compass,
  Home,
  Navigation,
  AlertTriangle,
  Radio,
  ExternalLink,
  ChevronRight,
  LifeBuoy,
  Languages
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CitizenView() {
  const { villages } = useData();

  const [selectedVillageId, setSelectedVillageId] = useState('v-dharali');
  const [langHindi, setLangHindi] = useState(false);

  const village = villages.find(v => v.id === selectedVillageId) || villages[0];
  const isCritical = village.riskLevel === 'critical';
  const isHigh = village.riskLevel === 'high';

  // Find nearest shelter
  const shelter = EVACUATION_SHELTERS.find(
    s => s.villageId === village.id || s.villageName.toLowerCase().includes(village.name.toLowerCase())
  ) || EVACUATION_SHELTERS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* Top Mobile-Friendly Public Banner */}
      <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight font-mono text-white">HimaGuard Public</span>
              <p className="text-[10px] text-cyan-400 font-medium">Citizen Disaster Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Hindi / English Toggle */}
            <button
              onClick={() => setLangHindi(!langHindi)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span>{langHindi ? 'English' : '??????'}</span>
            </button>

            <Link
              to="/dashboard"
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
            >
              Staff
            </Link>
          </div>
        </div>
      </header>

      {/* Main Single Column (Mobile-First Emergency View) */}
      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-4">
        
        {/* Settlement Location Picker */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{langHindi ? '???? ???? / ??????? ?????:' : 'Select Your Village / Area:'}</span>
          </label>
          <select
            value={selectedVillageId}
            onChange={e => setSelectedVillageId(e.target.value)}
            className="w-full px-3 py-2 text-sm font-bold bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
          >
            {villages.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.district})
              </option>
            ))}
          </select>
        </div>

        {/* DOMINANT THREAT STATUS CARD (5-Second Rule for Rural Citizens) */}
        <div className={`p-6 rounded-3xl border-2 text-center shadow-2xl transition-all ${
          isCritical
            ? 'bg-gradient-to-b from-rose-950/70 via-slate-900 to-slate-950 border-rose-500 ring-4 ring-rose-500/20 animate-pulse'
            : isHigh
            ? 'bg-gradient-to-b from-orange-950/50 via-slate-900 to-slate-950 border-orange-500 ring-2 ring-orange-500/20'
            : 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/50'
        }`}>
          <div className="flex justify-center mb-2">
            <RiskBadge level={village.riskLevel} size="lg" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white mt-2 uppercase">
            {langHindi ? (
              isCritical ? '?????? ???????? ????? ?? ????' : isHigh ? '???? ??????? ??????' : '??????? ??????'
            ) : (
              isCritical ? 'EVACUATE IMMEDIATELY' : isHigh ? 'FLOOD WARNING ACTIVE' : 'SAFE / NORMAL'
            )}
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-950/90 p-3 rounded-2xl border border-slate-800/80">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                {langHindi ? '???? ?? ???????' : 'Flood Probability'}
              </div>
              <div className="text-2xl font-black text-rose-400 font-mono mt-0.5">
                {village.floodProbability}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                {langHindi ? '???????? ???' : 'Safe Window'}
              </div>
              <div className="text-xl font-black text-amber-300 font-mono mt-0.5">
                {village.leadTime}
              </div>
            </div>
          </div>

          {/* ONE-LINE PLAIN-LANGUAGE IMMEDIATE ACTION (High visual dominance) */}
          <div className="mt-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left">
            <div className="text-[10px] uppercase font-extrabold tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{langHindi ? '???????:' : 'IMMEDIATE DIRECTIVE:'}</span>
            </div>
            <p className="text-xs font-semibold text-slate-100 leading-relaxed">
              {langHindi ? (
                isCritical
                  ? `??? ?????? ?? ??? ???? ?? ????? ???? ????? ??? ???????? ??????? ??? ?? ?? ????? ????? ?? ?????? ?? ??? ? ?????`
                  : `???? ????? ?? ???? ????? ???? ?? ??? ?????? ?? ??? ???? ?? ??????? ?? ????? ?? ????? ????`
              ) : (
                isCritical
                  ? `MOVE UPHILL IMMEDIATELY: River rising rapidly (+2.2m). Proceed to GMVN Rest House on high ground. Avoid riverbeds, bridges, and culverts.`
                  : `Heavy rainfall detected in upper catchment. Avoid stepping near riverbanks. Keep mobile phones charged.`
              )}
            </p>
          </div>
        </div>

        {/* NEAREST DESIGNATED SHELTER BUTTON / CARD */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {langHindi ? '?????? ???????? ????? ????' : 'Nearest Evacuation Shelter'}
                </h3>
                <div className="text-sm font-bold text-white">{shelter.name}</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">{langHindi ? '?????:' : 'Elevation:'}</span>
              <span className="font-bold text-slate-200">{shelter.elevation}m ASL (High Ground)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{langHindi ? '??????:' : 'Available Capacity:'}</span>
              <span className="font-bold text-emerald-400">{shelter.capacity - shelter.currentOccupancy} spaces open</span>
            </div>
          </div>

          {/* Safe Route Direction */}
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5 mb-1">
              <Navigation className="w-3.5 h-3.5" />
              <span>{langHindi ? '???????? ?????:' : 'Safe Route Guidance:'}</span>
            </div>
            <p className="text-slate-300 font-medium">
              {shelter.safeRoute}
            </p>
          </div>
        </div>

        {/* SPEED-DIAL EMERGENCY CONTROL ROOM BUTTONS */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
            {langHindi ? '????????? ?????? ????' : 'One-Tap Emergency Helplines'}
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:1070"
              className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>SDRF (1070)</span>
            </a>

            <a
              href="tel:112"
              className="p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30 transition"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Police / DEOC (112)</span>
            </a>
          </div>
        </div>

        {/* Offline Safety Tips */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-2">
          <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>{langHindi ? '??????? ??????? ????:' : 'Quick Offline Safety Protocol:'}</span>
          </h4>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
            <li>{langHindi ? '??? ?? ???? ?? ??? ??? ? ??????' : 'Never stay or take shelter inside dry river gorges during heavy rain.'}</li>
            <li>{langHindi ? '??? ?? ????? ?? ???? ???? ?? ??? ? ?????' : 'Never attempt to cross flooded causeways or submerged culverts.'}</li>
            <li>{langHindi ? '????? ?? ????? ?? ???????????? ?? ??? ?????' : 'Stay clear of fallen electric lines and saturated retaining walls.'}</li>
          </ul>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-900">
        HimaGuard Public Emergency Portal ? Prototype Demonstration Data
      </footer>

    </div>
  );
}
