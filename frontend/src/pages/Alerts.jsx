import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import AlertCard from '../components/alerts/AlertCard';
import CreateAlertModal from '../components/alerts/CreateAlertModal';
import {
  AlertTriangle,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Radio,
  Send,
  ShieldAlert
} from 'lucide-react';

export default function Alerts() {
  const { alerts, acknowledgeAlert } = useData();

  const [activeTab, setActiveTab] = useState('active');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter alerts
  const filteredAlerts = alerts.filter(a => {
    const matchTab = activeTab === 'all' || a.status === activeTab;
    const matchSeverity = severityFilter === 'all' || a.severity === severityFilter;
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.villageName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSeverity && matchSearch;
  });

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const criticalCount = alerts.filter(a => a.status === 'active' && a.severity === 'critical').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              Emergency Directives & Evacuation Warnings
            </h1>
            {criticalCount > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold animate-pulse">
                {criticalCount} CRITICAL DIRECTIVES ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official early warning bulletins dispatched to village acoustic sirens, public cell broadcasts, and DEOC radios.
          </p>
        </div>

        {/* Create Alert Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-900/30 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Simulate Emergency Broadcast</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'active', label: `Active (${activeCount})` },
            { id: 'acknowledged', label: 'Acknowledged' },
            { id: 'resolved', label: 'Resolved' },
            { id: 'all', label: 'All History' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Severity Filter Chips */}
        <div className="flex items-center gap-1.5">
          {['all', 'critical', 'high', 'moderate', 'info'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium capitalize transition ${
                severityFilter === sev
                  ? 'bg-slate-800 text-slate-100 border border-slate-700 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search alerts..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

      </div>

      {/* Alerts Stream List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={acknowledgeAlert}
            />
          ))
        ) : (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200">No matching directives</h3>
            <p className="text-xs">There are currently no alerts matching your filter criteria.</p>
          </div>
        )}
      </div>

      {/* Alert Creation Modal */}
      <CreateAlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}
