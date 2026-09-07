import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { X, Send, AlertTriangle, ShieldCheck, Radio } from 'lucide-react';

export default function CreateAlertModal({ isOpen, onClose }) {
  const { villages, addNewAlert } = useData();

  const [selectedVillageId, setSelectedVillageId] = useState(villages[0]?.id || 'v-dharali');
  const [severity, setSeverity] = useState('critical');
  const [title, setTitle] = useState('Flash Flood Evacuation Notice - Heavy Rainfall Threshold Breached');
  const [probability, setProbability] = useState(85);
  const [leadTime, setLeadTime] = useState('45 mins');
  const [recommendedAction, setRecommendedAction] = useState(
    'Initiate immediate Phase-1 evacuation of all residents in riverside sectors. Sound emergency sirens and move upwards to high-ground community shelters.'
  );
  const [channels, setChannels] = useState({
    siren: true,
    sms: true,
    vhf: true,
    cap: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = villages.find(x => x.id === selectedVillageId) || villages[0];
    const activeChannels = [];
    if (channels.siren) activeChannels.push('Automated Sirens');
    if (channels.sms) activeChannels.push('SMS Cell Broadcast');
    if (channels.vhf) activeChannels.push('DEOC VHF Ch 2');
    if (channels.cap) activeChannels.push('NDMA CAP Protocol');

    addNewAlert({
      villageId: v.id,
      villageName: v.name,
      severity,
      title,
      probability: Number(probability),
      leadTime,
      recommendedAction,
      channels: activeChannels
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Simulate Emergency Broadcast</h3>
              <p className="text-xs text-slate-400">Issue Hyperlocal Warning & Evacuation Directives</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          {/* Target Settlement */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Target Settlement / Basin</label>
            <select
              value={selectedVillageId}
              onChange={e => setSelectedVillageId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
            >
              {villages.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.district} ? {v.riverBasin} Basin)
                </option>
              ))}
            </select>
          </div>

          {/* Severity & Probability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Severity Level</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 capitalize font-medium"
              >
                <option value="critical">Critical (Red)</option>
                <option value="high">High (Orange)</option>
                <option value="moderate">Moderate (Yellow)</option>
                <option value="info">Advisory (Info)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Probability (%)</label>
              <input
                type="number"
                min="1"
                max="99"
                value={probability}
                onChange={e => setProbability(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Est. Lead Time</label>
              <input
                type="text"
                value={leadTime}
                onChange={e => setLeadTime(e.target.value)}
                placeholder="e.g. 45 mins"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Bulletin Headline</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          {/* Recommended Action */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Directive & Evacuation Guidance</label>
            <textarea
              rows={3}
              value={recommendedAction}
              onChange={e => setRecommendedAction(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
              required
            />
          </div>

          {/* Broadcast Channels */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Dispatch Channels</label>
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.siren}
                  onChange={e => setChannels(c => ({ ...c, siren: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
                />
                <span>Local Acoustic Sirens</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.sms}
                  onChange={e => setChannels(c => ({ ...c, sms: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
                />
                <span>Cell Broadcast (SMS)</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.vhf}
                  onChange={e => setChannels(c => ({ ...c, vhf: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
                />
                <span>DEOC Wireless Net</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={channels.cap}
                  onChange={e => setChannels(c => ({ ...c, cap: e.target.checked }))}
                  className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
                />
                <span>NDMA CAP Gateway</span>
              </label>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-900/30 transition"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Bulletin</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
