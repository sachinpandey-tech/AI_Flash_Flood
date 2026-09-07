import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export default function DemoWatermark() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-3 px-4 text-xs text-slate-400 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            SIMULATED DEMO DATA
          </span>
          <span className="text-slate-400 text-[11px]">
            SIH 2026 Problem Statement SIH26192 ? Prototype Decision Support & Early Warning System
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>Complements NDMA / SDMA / CWC Protocols</span>
          <span className="hidden md:inline">?</span>
          <span className="hidden md:inline flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            All metrics illustrative
          </span>
        </div>
      </div>
    </footer>
  );
}
