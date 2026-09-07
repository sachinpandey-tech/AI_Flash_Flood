import React, { useState, useEffect, useRef } from 'react';
import { HISTORICAL_EVENTS } from '../services/mockData';
import RiskBadge from '../components/common/RiskBadge';
import {
  History,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  AlertTriangle,
  CloudRain,
  Droplets,
  Waves,
  Activity,
  Calendar,
  Layers,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function HistoricalEvents() {
  const [selectedEventId, setSelectedEventId] = useState(HISTORICAL_EVENTS[0].id);
  const activeEvent = HISTORICAL_EVENTS.find(e => e.id === selectedEventId) || HISTORICAL_EVENTS[0];

  // Replay Player State
  const [replayStep, setReplayStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const replayIntervalRef = useRef(null);

  const REPLAY_STAGES = [
    {
      step: 0,
      label: 'Normal Baseline (T-4h)',
      risk: 'low',
      rain: 18,
      soil: 54,
      water: 1.15,
      prob: 12,
      desc: 'Ambient alpine weather. Catchment infiltration active.'
    },
    {
      step: 1,
      label: 'Precipitation Inflow (T-2h)',
      risk: 'moderate',
      rain: 48,
      soil: 69,
      water: 1.70,
      prob: 42,
      desc: 'High-intensity convective cloud cell anchoring on valley ridge.'
    },
    {
      step: 2,
      label: 'Torrential Saturation (T-1h)',
      risk: 'high',
      rain: 78,
      soil: 84,
      water: 2.45,
      prob: 74,
      desc: 'Topsoil saturation exceeded. Debris channels begin mobilizing slurry.'
    },
    {
      step: 3,
      label: 'Cloudburst Surge (T-20m)',
      risk: 'high',
      rain: 112,
      soil: 92,
      water: 2.95,
      prob: 88,
      desc: 'Cloudburst in full effect. Acoustic geophones detect heavy boulder movements.'
    },
    {
      step: 4,
      label: 'Peak Flash Flood Wave (T-0)',
      risk: 'critical',
      rain: 128,
      soil: 96,
      water: 3.60,
      prob: 98,
      desc: 'PEAK SURGE INUNDATION: River gauge exceeds danger level by 0.6m. Rapid breach!'
    }
  ];

  const currentReplay = REPLAY_STAGES[replayStep];

  useEffect(() => {
    if (isPlaying) {
      replayIntervalRef.current = setInterval(() => {
        setReplayStep(prev => {
          if (prev >= REPLAY_STAGES.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    } else {
      if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
    }
    return () => {
      if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
    };
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setReplayStep(0);
  };

  const handleStepForward = () => {
    setReplayStep(s => Math.min(REPLAY_STAGES.length - 1, s + 1));
  };

  // Build chart data up to current step
  const replayChartData = REPLAY_STAGES.slice(0, replayStep + 1).map(st => ({
    time: st.label.split(' ')[0],
    water: st.water,
    rain: st.rain,
    prob: st.prob
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Historical Calamity Logs & Event Replay Engine
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 font-mono">
              Post-Disaster Re-analysis
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical benchmarking against iconic Himalayan deluge events to validate lead-time gain.
          </p>
        </div>
      </div>

      {/* Replay Player Card (The Signature Interactive Demo Feature) */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Interactive Event Replay Simulator
              </span>
              <RiskBadge level={currentReplay.risk} size="sm" />
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              Replaying: <span className="text-cyan-300">{activeEvent.name}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Stepping through sensor progression to observe how lead-time warnings emerge ahead of the flood wave.
            </p>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(p => !p)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-900/30 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Replay' : 'Play Replay'}</span>
            </button>

            <button
              onClick={handleStepForward}
              disabled={replayStep >= REPLAY_STAGES.length - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 transition"
              title="Step Forward"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Reset to Baseline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progression Indicators */}
        <div className="my-5 grid grid-cols-5 gap-2">
          {REPLAY_STAGES.map((st, idx) => (
            <button
              key={st.step}
              onClick={() => { setIsPlaying(false); setReplayStep(idx); }}
              className={`p-2.5 rounded-xl text-left border transition ${
                replayStep === idx
                  ? 'bg-slate-800 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/20'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400">Stage {idx + 1}</div>
              <div className="text-xs font-bold text-slate-200 truncate mt-0.5">{st.label}</div>
              <div className="mt-1">
                <RiskBadge level={st.risk} size="sm" pulse={false} />
              </div>
            </button>
          ))}
        </div>

        {/* Animated Live Metrics Readout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-sky-400" /> Rainfall Intensity
            </div>
            <div className="text-2xl font-black text-sky-400 font-mono mt-1">
              {currentReplay.rain} <span className="text-xs font-normal">mm/h</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-amber-400" /> Soil Saturation
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">
              {currentReplay.soil}%
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Waves className="w-3.5 h-3.5 text-blue-400" /> River Stage
            </div>
            <div className="text-2xl font-black text-blue-400 font-mono mt-1">
              {currentReplay.water} <span className="text-xs font-normal">m</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-rose-400" /> Flood Probability
            </div>
            <div className="text-2xl font-black text-rose-400 font-mono mt-1">
              {currentReplay.prob}%
            </div>
          </div>
        </div>

        {/* Diagnostic Status */}
        <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{currentReplay.desc}</span>
        </div>
      </div>

      {/* Historical Disaster Logs Directory */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Himalayan Benchmark Events Log
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HISTORICAL_EVENTS.map(ev => (
            <div
              key={ev.id}
              onClick={() => { setSelectedEventId(ev.id); handleReset(); }}
              className={`p-5 rounded-2xl border cursor-pointer transition ${
                selectedEventId === ev.id
                  ? 'bg-slate-900 border-cyan-500 shadow-xl ring-1 ring-cyan-500/20'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                <span>{ev.date}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{ev.id}</span>
              </div>

              <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                {ev.name}
              </h4>

              <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                {ev.primaryCause}
              </p>

              <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800 pt-3 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Peak Q:</span>
                  <span className="font-bold text-cyan-400">{ev.peakDischarge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rainfall:</span>
                  <span className="text-slate-200">{ev.peakRainfall}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead Time:</span>
                  <span className="text-amber-400">{ev.leadTimeObserved}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-bold text-slate-300 block mb-0.5">Key Lesson:</span>
                <span className="line-clamp-2 italic">{ev.lessonsLearned}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
