import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import RiskBadge from '../common/RiskBadge';
import {
  Search,
  Filter,
  Layers,
  Radio,
  Home,
  Waves,
  TrendingUp,
  Droplets,
  CloudRain,
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { EVACUATION_SHELTERS } from '../../services/mockData';

// Helper to create custom colored DivIcon for villages
function createVillageIcon(riskLevel) {
  const norm = (riskLevel || 'low').toLowerCase();
  const colors = {
    low: { bg: '#22c55e', border: '#15803d', glow: 'rgba(34, 197, 94, 0.4)' },
    moderate: { bg: '#eab308', border: '#a16207', glow: 'rgba(234, 179, 8, 0.4)' },
    high: { bg: '#f97316', border: '#c2410c', glow: 'rgba(249, 115, 22, 0.6)' },
    critical: { bg: '#ef4444', border: '#b91c1c', glow: 'rgba(239, 68, 68, 0.8)' }
  };
  const c = colors[norm] || colors.low;
  const isHighOrCrit = norm === 'high' || norm === 'critical';

  return L.divIcon({
    className: 'custom-village-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        ${isHighOrCrit ? `
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: ${c.bg};
            opacity: 0.4;
            animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
        ` : ''}
        <div style="
          position: relative;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${c.bg};
          border: 3px solid #0f172a;
          box-shadow: 0 0 12px ${c.glow}, 0 2px 4px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
}

// Sensor marker icon
function createSensorIcon() {
  return L.divIcon({
    className: 'custom-sensor-pin',
    html: `
      <div style="
        width: 18px;
        height: 18px;
        border-radius: 6px;
        background: #0ea5e9;
        border: 2px solid #0f172a;
        box-shadow: 0 0 8px rgba(14, 165, 233, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 9px;
        font-weight: bold;
      ">
        ??
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9]
  });
}

// Shelter marker icon
function createShelterIcon() {
  return L.divIcon({
    className: 'custom-shelter-pin',
    html: `
      <div style="
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #8b5cf6;
        border: 2px solid #0f172a;
        box-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
      ">
        ??
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9]
  });
}

// Recenter Map Helper
function RecenterOnSelect({ coords }) {
  const map = useMap();
  React.useEffect(() => {
    if (coords) {
      map.flyTo(coords, 12, { duration: 1.2 });
    }
  }, [coords, map]);
  return null;
}

export default function LiveRiskMap({ height = '600px', compact = false }) {
  const { villages, sensors } = useData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('all');
  const [layers, setLayers] = useState({
    villages: true,
    sensors: true,
    shelters: true
  });
  const [focusedCoords, setFocusedCoords] = useState(null);

  // Filtered villages
  const filteredVillages = useMemo(() => {
    return villages.filter(v => {
      const matchSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.riverBasin.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRisk = selectedRiskFilter === 'all' || v.riskLevel === selectedRiskFilter;
      return matchSearch && matchRisk;
    });
  }, [villages, searchQuery, selectedRiskFilter]);

  // Center coordinate of Uttarakhand Garhwal region
  const centerPosition = [30.45, 79.15];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col shadow-2xl">
      
      {/* Map Filter & Controls Bar */}
      {!compact && (
        <div className="p-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 z-10">
          
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search village, river basin, district..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Risk Level Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'critical', 'high', 'moderate', 'low'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedRiskFilter(lvl)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium capitalize transition ${
                  selectedRiskFilter === lvl
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Layer Toggles */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLayers(l => ({ ...l, villages: !l.villages }))}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border transition ${
                layers.villages
                  ? 'bg-slate-800 text-slate-200 border-slate-700'
                  : 'text-slate-400 border-slate-800 line-through opacity-60'
              }`}
              title="Toggle Village Risk Settlements"
            >
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Villages</span>
            </button>

            <button
              onClick={() => setLayers(l => ({ ...l, sensors: !l.sensors }))}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border transition ${
                layers.sensors
                  ? 'bg-slate-800 text-sky-300 border-slate-700'
                  : 'text-slate-400 border-slate-800 line-through opacity-60'
              }`}
              title="Toggle IoT Telemetry Stations"
            >
              <Radio className="w-3 h-3 text-sky-400" />
              <span>Sensors</span>
            </button>

            <button
              onClick={() => setLayers(l => ({ ...l, shelters: !l.shelters }))}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border transition ${
                layers.shelters
                  ? 'bg-slate-800 text-purple-300 border-slate-700'
                  : 'text-slate-400 border-slate-800 line-through opacity-60'
              }`}
              title="Toggle Evacuation Shelters"
            >
              <Home className="w-3 h-3 text-purple-400" />
              <span>Shelters</span>
            </button>
          </div>

        </div>
      )}

      {/* Leaflet Map Canvas */}
      <div style={{ height }} className="w-full relative z-0">
        <MapContainer
          center={centerPosition}
          zoom={9}
          scrollWheelZoom={true}
          className="h-full w-full"
          attributionControl={false}
        >
          {/* Recenter listener */}
          <RecenterOnSelect coords={focusedCoords} />

          {/* CartoDB Dark Matter Tiles */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />

          {/* Village Risk Markers */}
          {layers.villages && filteredVillages.map(village => (
            <Marker
              key={village.id}
              position={[village.lat, village.lng]}
              icon={createVillageIcon(village.riskLevel)}
            >
              <Popup className="custom-popup">
                <div className="p-3.5 max-w-[280px]">
                  
                  {/* Popup Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{village.name}</h4>
                      <p className="text-[11px] text-slate-400">{village.district} ? {village.riverBasin} Basin</p>
                    </div>
                    <RiskBadge level={village.riskLevel} size="sm" />
                  </div>

                  {/* Probability & Lead Time (Dominant Visual Element) */}
                  <div className="my-2.5 grid grid-cols-2 gap-2 bg-slate-950/90 p-2 rounded-xl border border-slate-800/80">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Flood Prob.</div>
                      <div className="text-base font-extrabold text-rose-400 font-mono">
                        {village.floodProbability}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Lead Time</div>
                      <div className="text-xs font-bold text-amber-300 font-mono">
                        {village.leadTime}
                      </div>
                    </div>
                  </div>

                  {/* Realtime Hydrology metrics */}
                  <div className="space-y-1.5 text-xs text-slate-300 pb-3 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <CloudRain className="w-3.5 h-3.5 text-sky-400" /> Rain Rate (1h)
                      </span>
                      <span className="font-mono font-semibold text-slate-200">{village.rainfall1h} mm/h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Droplets className="w-3.5 h-3.5 text-amber-400" /> Soil Saturation
                      </span>
                      <span className="font-mono font-semibold text-slate-200">{village.soilMoisture}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Waves className="w-3.5 h-3.5 text-blue-400" /> Water Level
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-semibold text-slate-200">{village.waterLevel} m</span>
                        <span className="text-[10px] text-rose-400 font-bold">
                          {village.waterLevelTrend === 'rising' ? '?' : '?'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Deep Dive Action Button */}
                  <div className="pt-2.5">
                    <button
                      onClick={() => navigate(`/villages/${village.id}`)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition"
                    >
                      <span>View Detailed Analysis</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </Popup>
            </Marker>
          ))}

          {/* IoT Sensor Markers */}
          {layers.sensors && sensors.map(s => {
            const linkedVillage = villages.find(v => v.id === s.villageId);
            if (!linkedVillage) return null;
            // Slight offset so it does not collide perfectly with village marker
            const offsetLat = linkedVillage.lat + 0.006;
            const offsetLng = linkedVillage.lng + 0.007;

            return (
              <Marker
                key={s.id}
                position={[offsetLat, offsetLng]}
                icon={createSensorIcon()}
              >
                <Popup className="custom-popup">
                  <div className="p-3 text-xs max-w-[220px]">
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <span className="text-sky-400">??</span> {s.name}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{s.type} ? {s.villageName}</div>
                    
                    <div className="my-2 p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">Current Value:</span>
                      <span className="text-sm font-bold text-sky-300 font-mono">{s.value} {s.unit}</span>
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Battery: {s.battery}%</span>
                      <span className="text-emerald-400 font-medium">Online</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Evacuation Shelter Markers */}
          {layers.shelters && EVACUATION_SHELTERS.map(sh => (
            <Marker
              key={sh.id}
              position={[sh.lat, sh.lng]}
              icon={createShelterIcon()}
            >
              <Popup className="custom-popup">
                <div className="p-3 text-xs max-w-[240px]">
                  <div className="font-bold text-slate-100 flex items-center gap-1.5">
                    <span className="text-purple-400">??</span> {sh.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{sh.villageName} ? Elev: {sh.elevation}m</div>
                  
                  <div className="my-2 p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Capacity:</span>
                      <span className="font-bold text-slate-200">{sh.capacity} persons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current:</span>
                      <span className="font-bold text-purple-400">{sh.currentOccupancy} persons</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 italic">
                    Safe Route: {sh.safeRoute}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800 backdrop-blur-md p-2.5 rounded-xl shadow-xl z-10 text-[11px] space-y-1.5">
          <div className="font-bold text-slate-300 text-[10px] uppercase tracking-wider mb-1">
            Flood Risk Level
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Low (&lt;30%)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Moderate (30-60%)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>High (60-80%)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-300 font-semibold">Critical (&gt;80%)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
