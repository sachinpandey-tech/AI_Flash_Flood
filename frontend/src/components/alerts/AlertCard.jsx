import React from 'react';
import { useNavigate } from 'react-router-dom';
import RiskBadge from '../common/RiskBadge';
import {
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  Radio,
  ExternalLink,
  Volume2,
  Send
} from 'lucide-react';

export default function AlertCard({ alert, onAcknowledge }) {
  const navigate = useNavigate();

  const isCritical = alert.severity === 'critical';
  const isHigh = alert.severity === 'high';
  const isResolved = alert.status === 'resolved';
  const isAck = alert.status === 'acknowledged';

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 ${
        isCritical
          ? 'border-rose-500/50 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30 ring-1 ring-rose-500/30'
          : isHigh
          ? 'border-orange-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/20'
          : 'border-slate-800 bg-slate-900/90'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${
            isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse' :
            isHigh ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-300'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <RiskBadge level={alert.severity} size="sm" />
              <span className="text-xs text-slate-400 font-mono">{alert.id}</span>
              {isAck && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  ACKNOWLEDGED
                </span>
              )}
              {isResolved && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  RESOLVED
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-slate-100 mt-1">{alert.title}</h4>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{alert.timestamp}</span>
        </div>
      </div>

      {/* Target Village & Urgency KPI */}
      <div className="my-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Location</div>
            <div className="font-semibold text-slate-200">{alert.villageName}</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Probability</div>
            <div className="font-bold text-rose-400 font-mono">{alert.probability}%</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Est. Lead Time</div>
            <div className="font-bold text-amber-300 font-mono">{alert.leadTime}</div>
          </div>
        </div>
      </div>

      {/* Recommended Action */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 mb-3">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
          Recommended Incident Commander Directive
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          {alert.recommendedAction}
        </p>
      </div>

      {/* Broadcast Channels & Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-400 mr-1">Telemetry:</span>
          {alert.channels && alert.channels.map((ch, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              {ch}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => navigate('/map')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition flex items-center gap-1"
          >
            <span>View Map</span>
          </button>

          <button
            onClick={() => navigate(`/villages/${alert.villageId}`)}
            className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition flex items-center gap-1"
          >
            <span>View Village</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          {alert.status === 'active' && onAcknowledge && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Acknowledge</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
