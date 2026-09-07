import React from 'react';
import { useData, SIMULATION_STAGES } from '../../context/DataContext';
import { Play, Pause, RotateCcw, AlertTriangle, CloudLightning, Activity, Droplets, Waves } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export default function SimulationController() {
  const { simulation, stopSimulation, jumpToStage, villages } = useData();

  if (!simulation.isActive) return null;

  const currentStageInfo = SIMULATION_STAGES[simulation.currentStage] || SIMULATION_STAGES[0];
  const targetVillage = villages.find(v => v.id === simulation.targetVillageId) || villages[0];

  return (
    <div className="fixed bottom-14 left-4 right-4 md:left-72 md:right-8 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 border-2 border-rose-500/60 rounded-2xl p-4 shadow-2xl backdrop-blur-xl ring-4 ring-rose-500/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Header & Target info */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
              <CloudLightning className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold tracking-wider uppercase">
                  SIMULATION ACTIVE
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  Flash Flood Sequence: <span className="text-rose-400">{targetVillage.name}</span>
                </h4>
                <RiskBadge level={currentStageInfo.riskLevel} size="sm" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentStageInfo.statusText}
              </p>
            </div>
          </div>

          {/* Realtime Simulation Hydrology Metrics */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center px-2">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-medium">
                <CloudLightning className="w-3 h-3 text-sky-400" /> Rain
              </div>
              <div className="text-sm font-bold text-sky-400 font-mono">
                {currentStageInfo.rainfall} <span className="text-[10px] font-normal">mm/h</span>
              </div>
            </div>
            <div className="text-center px-2 border-l border-slate-800">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-medium">
                <Droplets className="w-3 h-3 text-amber-400" /> Soil Sat.
              </div>
              <div className="text-sm font-bold text-amber-400 font-mono">
                {currentStageInfo.soilMoisture}%
              </div>
            </div>
            <div className="text-center px-2 border-l border-slate-800">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-medium">
                <Waves className="w-3 h-3 text-blue-400" /> Water Lvl
              </div>
              <div className="text-sm font-bold text-blue-400 font-mono">
                {currentStageInfo.waterLevel} <span className="text-[10px] font-normal">m</span>
              </div>
            </div>
            <div className="text-center px-2 border-l border-slate-800">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-medium">
                <Activity className="w-3 h-3 text-rose-400" /> Prob.
              </div>
              <div className="text-sm font-bold text-rose-400 font-mono">
                {currentStageInfo.probability}%
              </div>
            </div>
          </div>

          {/* Quick Stage Scrubber & Reset Controls */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {SIMULATION_STAGES.map((st, idx) => (
                <button
                  key={st.stageIndex}
                  onClick={() => jumpToStage(idx, targetVillage.id)}
                  title={st.name}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    simulation.currentStage === idx
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  S{idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={stopSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              Reset
            </button>
          </div>

        </div>

        {/* Dynamic Progress Indicator Bar */}
        <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 h-full transition-all duration-500"
            style={{ width: `${((simulation.currentStage + 1) / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
