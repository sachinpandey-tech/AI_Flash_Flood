import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { getSensorReadings } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Radio,
  Search,
  Filter,
  Activity,
  Battery,
  Wifi,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
  Maximize2
} from 'lucide-react';

export default function Sensors() {
  const { sensors, villages } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [sensorHistory, setSensorHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Filter sensors
  const filteredSensors = sensors.filter(s => {
    const matchSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.villageName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedType === 'all' || s.type === selectedType;
    return matchSearch && matchType;
  });

  const handleRowClick = async (sensor) => {
    setSelectedSensor(sensor);
    setLoadingHistory(true);
    const history = await getSensorReadings(sensor.id, 24);
    setSensorHistory(history);
    setLoadingHistory(false);
  };

  const types = ['all', 'Automated Rain Gauge', 'Soil Moisture TDR', 'Ultrasonic Water Radar', 'Acoustic Geophone'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-400 animate-pulse" />
            <h1 className="text-xl font-bold text-white tracking-tight">
              IoT Sensor Network & Hydro Telemetry
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              28 / 28 NODES ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-modal telemetry relaying via LoRaWAN 868MHz, 4G LTE, and Satellite Iridium links. Click any row for 24h history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Network Health</div>
            <div className="text-sm font-bold text-emerald-400 font-mono">99.4% Uptime</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search sensor ID, type, or settlement..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Type Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium shrink-0 transition ${
                selectedType === t
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
              }`}
            >
              {t === 'all' ? 'All Modalities' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Sensor Data Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Sensor ID & Name</th>
                <th className="py-3 px-4">Modality</th>
                <th className="py-3 px-4">Settlement</th>
                <th className="py-3 px-4">Live Reading</th>
                <th className="py-3 px-4">Battery</th>
                <th className="py-3 px-4">Signal (RSSI)</th>
                <th className="py-3 px-4">Protocol</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSensors.map(sensor => (
                <tr
                  key={sensor.id}
                  onClick={() => handleRowClick(sensor)}
                  className="hover:bg-slate-800/50 cursor-pointer transition group"
                >
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-slate-200 group-hover:text-cyan-300">
                      {sensor.id}
                    </div>
                    <div className="text-[11px] text-slate-400">{sensor.name}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    {sensor.type}
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-200">
                    {sensor.villageName}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {sensor.value} {sensor.unit}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-slate-300">
                      <Battery className={`w-3.5 h-3.5 ${sensor.battery > 50 ? 'text-emerald-400' : 'text-amber-400'}`} />
                      <span>{sensor.battery}%</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-400">
                    {sensor.signal} dBm
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {sensor.protocol}
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sensor Drill-Down Modal / Slide-over */}
      {selectedSensor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <Radio className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {selectedSensor.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-100">{selectedSensor.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedSensor.type} ? Installed at {selectedSensor.villageName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSensor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spec Sheet Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Current Reading</span>
                <div className="font-bold text-cyan-400 font-mono text-base">
                  {selectedSensor.value} {selectedSensor.unit}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400">Battery Level</span>
                <div className="font-bold text-emerald-400 font-mono text-base">
                  {selectedSensor.battery}%
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400">Signal RSSI</span>
                <div className="font-bold text-slate-200 font-mono text-base">
                  {selectedSensor.signal} dBm
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400">Transmission</span>
                <div className="font-bold text-slate-200 truncate">
                  {selectedSensor.protocol}
                </div>
              </div>
            </div>

            {/* 24-Hour History Chart */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-bold text-slate-200">24-Hour Telemetry History Hydrograph</h4>
                <span className="text-slate-400 font-mono">1-Hour Resolution</span>
              </div>

              <div className="h-60 w-full pt-2">
                {loadingHistory ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    Loading sensor time series...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensorHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} unit={selectedSensor.unit} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="value" name={`Reading (${selectedSensor.unit})`} stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Close */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedSensor(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Close Spec Sheet
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
