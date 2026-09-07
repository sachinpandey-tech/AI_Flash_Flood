/**
 * HimaGuard: Geospatial GIS Risk Map Engine
 * SIH 2026 Problem Statement SIH26192
 * 
 * Interactive Leaflet GIS map with Himalayan river catchments,
 * multi-tier village vulnerability zones, IoT sensors, and evacuation routes.
 */

class HimaGuardMap {
  constructor() {
    this.map = null;
    this.dashboardMap = null;
    this.villageMarkers = {};
    this.sensorMarkers = {};
    this.shelterMarkers = {};
    this.layerGroups = {
      villages: null,
      rivers: null,
      sensors: null,
      shelters: null,
      riskZones: null
    };
    this.centerCoords = [30.38, 79.18]; // Himalayan Catchment Basin (Rudraprayag / Chamoli)
    this.currentTileTheme = 'dark';
    this.tileLayers = {};
  }

  init(containerId = 'liveRiskMapContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (typeof L === 'undefined') {
      console.warn('Leaflet not loaded. Rendering vector GIS fallback.');
      this.renderCanvasFallback(containerId);
      return;
    }

    try {
      this.map = L.map(containerId, {
        zoomControl: true,
        attributionControl: false
      }).setView(this.centerCoords, 11);

      // CartoDB Dark Matter Basemap
      this.tileLayers.dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(this.map);

      // OpenStreetMap Daylight Topo Basemap (Optional switcher)
      this.tileLayers.topo = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
      });

      // Initialize Layer Groups
      this.layerGroups.villages = L.layerGroup().addTo(this.map);
      this.layerGroups.rivers = L.layerGroup().addTo(this.map);
      this.layerGroups.sensors = L.layerGroup().addTo(this.map);
      this.layerGroups.shelters = L.layerGroup().addTo(this.map);
      this.layerGroups.riskZones = L.layerGroup().addTo(this.map);

      this.renderRivers();
      this.renderRiskZones();
      this.renderShelters();
      this.renderSensors();
      this.renderVillages();

      // Initialize Dashboard Mini Map if present
      const dashMapContainer = document.getElementById('dashboardMapPreview');
      if (dashMapContainer) {
        this.initDashboardMiniMap('dashboardMapPreview');
      }

      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, 300);

    } catch (e) {
      console.error('Leaflet initialization error:', e);
      this.renderCanvasFallback(containerId);
    }
  }

  initDashboardMiniMap(containerId) {
    try {
      this.dashboardMap = L.map(containerId, {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: false
      }).setView(this.centerCoords, 10);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(this.dashboardMap);

      // Render simplified rivers and villages on mini map
      this.renderSimplifiedRivers(this.dashboardMap);
      this.renderSimplifiedVillages(this.dashboardMap);

      setTimeout(() => {
        if (this.dashboardMap) this.dashboardMap.invalidateSize();
      }, 350);
    } catch (e) {
      console.log('Dashboard mini map notice:', e);
    }
  }

  getColorForStatus(status) {
    switch (status) {
      case 'Critical': return '#ef4444';
      case 'High':     return '#f97316';
      case 'Moderate': return '#eab308';
      case 'Low':
      default:         return '#10b981';
    }
  }

  renderRivers() {
    // 1. Mandakini River (Kedarnath -> Guptkashi -> Bhairavpur -> Tilwara -> Rudraprayag)
    const mandakiniRiver = [
      [30.6500, 79.0800],
      [30.5228, 79.0764], // Guptkashi
      [30.4185, 79.0669], // Bhairavpur
      [30.3540, 78.9890], // Tilwara
      [30.2844, 78.9811]  // Rudraprayag Confluence
    ];

    L.polyline(mandakiniRiver, {
      color: '#0284c7',
      weight: 6,
      opacity: 0.9,
      dashArray: '10, 6'
    }).addTo(this.layerGroups.rivers).bindTooltip('🌊 Mandakini River Main Gorge Channel (Flow: N -> S)', { sticky: true });

    // 2. Alaknanda River (Joshimath -> Chamoli -> Nandaprayag -> Karnaprayag -> Rudraprayag -> Srinagar -> Devprayag)
    const alaknandaRiver = [
      [30.5574, 79.5668], // Joshimath
      [30.4045, 79.3490], // Chamoli
      [30.3325, 79.3242], // Nandaprayag
      [30.2600, 79.2185], // Karnaprayag
      [30.2844, 78.9811], // Rudraprayag Sangam
      [30.2227, 78.7844], // Srinagar Garhwal
      [30.1459, 78.5986]  // Devprayag (Meeting Bhagirathi)
    ];

    L.polyline(alaknandaRiver, {
      color: '#0284c7',
      weight: 8,
      opacity: 0.85
    }).addTo(this.layerGroups.rivers).bindTooltip('🌊 Alaknanda River Master Trunk (Flow: NE -> SW)', { sticky: true });

    // 3. Pindar River (Glacial tributary feeding Karnaprayag)
    const pindarRiver = [
      [30.1800, 79.4500],
      [30.2200, 79.3300],
      [30.2600, 79.2185]  // Confluence at Karnaprayag
    ];

    L.polyline(pindarRiver, {
      color: '#0ea5e9',
      weight: 4,
      dashArray: '6, 6',
      opacity: 0.8
    }).addTo(this.layerGroups.rivers).bindTooltip('🌊 Pindar Glacial River Tributary', { sticky: true });
  }

  renderSimplifiedRivers(mapInstance) {
    const mainRiver = [
      [30.55, 79.56], [30.41, 79.34], [30.26, 79.21], [30.28, 78.98], [30.14, 78.59]
    ];
    L.polyline(mainRiver, { color: '#0284c7', weight: 5, opacity: 0.85 }).addTo(mapInstance);
  }

  renderRiskZones() {
    // High Risk Inundation Polygon: Bhairavpur Lower Depression
    const bhairavpurZone = [
      [30.428, 79.058],
      [30.426, 79.076],
      [30.412, 79.075],
      [30.410, 79.055]
    ];

    L.polygon(bhairavpurZone, {
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.35,
      weight: 2,
      dashArray: '5, 5'
    }).addTo(this.layerGroups.riskZones).bindTooltip('⚠️ High Inundation Risk Zone: Bhairavpur Lower Basin', { sticky: true });

    // Karnaprayag Sangam Flood Zone
    const karnaZone = [
      [30.268, 79.210],
      [30.266, 79.228],
      [30.254, 79.224],
      [30.255, 79.208]
    ];

    L.polygon(karnaZone, {
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.3,
      weight: 2,
      dashArray: '4, 4'
    }).addTo(this.layerGroups.riskZones).bindTooltip('⚠️ Sangam Inundation Depression Zone', { sticky: true });
  }

  renderShelters() {
    HIMAGUARD_DATA.villages.forEach(village => {
      if (village.evacuation && village.evacuation.shelters) {
        village.evacuation.shelters.forEach(sh => {
          const lat = village.coordinates[0] + 0.005;
          const lng = village.coordinates[1] - 0.004;

          const shelterIcon = L.divIcon({
            className: 'custom-shelter-pin',
            html: `
              <div style="background:#10b981; color:#fff; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:800; border:1px solid #ffffff; box-shadow:0 2px 6px rgba(0,0,0,0.6); white-space:nowrap;">
                🏫 ${sh.name.split(' ')[0]} (${sh.elevation})
              </div>
            `,
            iconSize: [110, 20],
            iconAnchor: [55, 10]
          });

          L.marker([lat, lng], { icon: shelterIcon })
            .addTo(this.layerGroups.shelters)
            .bindPopup(`
              <div style="font-family:inherit; padding:4px;">
                <strong style="color:#10b981;">🏫 Designated Safe Shelter</strong><br>
                <strong>${sh.name}</strong><br>
                <span>Capacity: <strong>${sh.capacity} persons</strong></span><br>
                <span>Distance: <strong>${sh.distance}</strong> (Elevation: <strong>${sh.elevation}</strong>)</span><br>
                <span>Status: <strong style="color:#10b981;">OPERATIONAL & READY</strong></span>
              </div>
            `);
        });
      }
    });
  }

  renderSensors() {
    HIMAGUARD_DATA.sensors.forEach(sensor => {
      const isOnline = sensor.status === 'ONLINE';
      const color = isOnline ? '#38bdf8' : (sensor.status === 'WARNING' ? '#f59e0b' : '#64748b');

      const sensorIcon = L.divIcon({
        className: 'custom-sensor-pin',
        html: `
          <div style="background:${color}; width:12px; height:12px; border-radius:50%; border:2px solid #0f172a; box-shadow:0 0 8px ${color};"></div>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      const marker = L.marker(sensor.coordinates, { icon: sensorIcon })
        .addTo(this.layerGroups.sensors)
        .bindPopup(`
          <div style="font-family:inherit; min-width:160px; padding:4px;">
            <strong style="color:#38bdf8;">📡 IoT Telemetry Node [${sensor.id}]</strong><br>
            <strong>${sensor.type}</strong> (${sensor.village})<br>
            <div style="font-size:1.1rem; font-weight:bold; margin:4px 0;">${sensor.value}</div>
            <div style="font-size:0.75rem; color:#64748b;">
              Battery: <strong>${sensor.battery}%</strong> • Signal: <strong>${sensor.signal}</strong><br>
              Status: <strong style="color:${color};">${sensor.status}</strong>
            </div>
          </div>
        `);

      this.sensorMarkers[sensor.id] = marker;
    });
  }

  renderVillages() {
    HIMAGUARD_DATA.villages.forEach(v => {
      const color = this.getColorForStatus(v.status);
      const isCrit = v.status === 'Critical';

      const customIcon = L.divIcon({
        className: 'village-map-pin',
        html: `
          <div class="v-pin-wrap" style="position:relative; cursor:pointer;">
            <div class="v-pin-pulse" style="position:absolute; width:30px; height:30px; border-radius:50%; background:${color}; opacity:0.4; animation:${isCrit ? 'ping 1s infinite' : 'ping 2.5s infinite'};"></div>
            <div class="v-pin-dot" style="position:relative; width:16px; height:16px; border-radius:50%; background:${color}; border:2px solid #ffffff; box-shadow:0 0 10px ${color};"></div>
            <div class="v-pin-label" style="position:absolute; left:18px; top:-6px; background:rgba(15,23,42,0.95); border:1px solid rgba(255,255,255,0.15); border-left:3px solid ${color}; padding:2px 6px; border-radius:4px; font-size:11px; white-space:nowrap; box-shadow:0 4px 10px rgba(0,0,0,0.5);">
              <strong style="color:#ffffff;">${v.name}</strong>
              <span style="display:block; font-size:9px; font-weight:bold; color:${color};">${v.status.toUpperCase()} (${v.floodProbability}%)</span>
            </div>
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [8, 8]
      });

      const popupContent = `
        <div class="map-village-popup" style="font-family:inherit; min-width:230px; padding:4px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.1); pb-1;">
            <div>
              <h4 style="margin:0; font-size:14px; font-weight:800; color:#fff;">${v.name}</h4>
              <span style="font-size:10px; color:#94a3b8;">${v.district} District • ${v.nearbyRiver}</span>
            </div>
            <span style="background:${color}22; color:${color}; border:1px solid ${color}66; font-size:10px; font-weight:bold; padding:2px 6px; border-radius:4px;">
              ${v.status.toUpperCase()}
            </span>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; background:rgba(0,0,0,0.25); padding:6px; border-radius:6px; margin-bottom:8px; font-size:11px;">
            <div>Probability: <strong style="color:${color};">${v.floodProbability}%</strong></div>
            <div>Lead Time: <strong style="color:#f43f5e;">${v.estimatedLeadTime} min</strong></div>
            <div>Rainfall: <strong>${v.sensors.rainGauge} mm/h</strong></div>
            <div>Water Level: <strong>${v.sensors.waterLevel} m</strong></div>
            <div>Soil Moisture: <strong>${v.sensors.soilMoisture}%</strong></div>
            <div>Surge Rate: <strong style="color:#f59e0b;">${v.sensors.waterLevelChange}</strong></div>
          </div>

          <button onclick="window.himaGuardApp.openVillageDetails('${v.id}')" style="width:100%; background:linear-gradient(135deg, #0284c7, #2563eb); color:#fff; border:none; padding:6px 10px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">
            View Detailed Analysis →
          </button>
        </div>
      `;

      const marker = L.marker(v.coordinates, { icon: customIcon })
        .addTo(this.layerGroups.villages)
        .bindPopup(popupContent);

      this.villageMarkers[v.id] = marker;
    });
  }

  renderSimplifiedVillages(mapInstance) {
    HIMAGUARD_DATA.villages.forEach(v => {
      const color = this.getColorForStatus(v.status);
      const icon = L.divIcon({
        className: 'mini-v-pin',
        html: `<div style="width:10px; height:10px; border-radius:50%; background:${color}; border:1px solid #fff;"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      });
      L.marker(v.coordinates, { icon: icon }).addTo(mapInstance).bindTooltip(v.name + ` (${v.status})`);
    });
  }

  updateVillageMarker(villageId, newStatus, newProbability) {
    const v = HIMAGUARD_DATA.villages.find(x => x.id === villageId);
    if (!v) return;

    v.status = newStatus;
    v.floodProbability = newProbability;
    const color = this.getColorForStatus(newStatus);
    const isCrit = newStatus === 'Critical';

    if (this.villageMarkers[villageId]) {
      const newIcon = L.divIcon({
        className: 'village-map-pin',
        html: `
          <div class="v-pin-wrap" style="position:relative; cursor:pointer;">
            <div class="v-pin-pulse" style="position:absolute; width:34px; height:34px; border-radius:50%; background:${color}; opacity:0.5; animation:${isCrit ? 'ping 0.8s infinite' : 'ping 2s infinite'};"></div>
            <div class="v-pin-dot" style="position:relative; width:18px; height:18px; border-radius:50%; background:${color}; border:2px solid #ffffff; box-shadow:0 0 14px ${color};"></div>
            <div class="v-pin-label" style="position:absolute; left:20px; top:-6px; background:rgba(15,23,42,0.95); border:1px solid rgba(255,255,255,0.2); border-left:3px solid ${color}; padding:2px 8px; border-radius:4px; font-size:11px; white-space:nowrap; box-shadow:0 4px 10px rgba(0,0,0,0.5);">
              <strong style="color:#ffffff;">${v.name}</strong>
              <span style="display:block; font-size:9px; font-weight:bold; color:${color};">${newStatus.toUpperCase()} (${newProbability}%)</span>
            </div>
          </div>
        `,
        iconSize: [120, 30],
        iconAnchor: [9, 9]
      });
      this.villageMarkers[villageId].setIcon(newIcon);
    }
  }

  toggleLayer(layerName, isVisible) {
    if (!this.map || !this.layerGroups[layerName]) return;
    if (isVisible) {
      this.layerGroups[layerName].addTo(this.map);
    } else {
      this.map.removeLayer(this.layerGroups[layerName]);
    }
  }

  toggleBasemap(theme) {
    if (!this.map) return;
    if (theme === 'topo') {
      this.map.removeLayer(this.tileLayers.dark);
      this.tileLayers.topo.addTo(this.map);
      this.currentTileTheme = 'topo';
    } else {
      this.map.removeLayer(this.tileLayers.topo);
      this.tileLayers.dark.addTo(this.map);
      this.currentTileTheme = 'dark';
    }
  }

  searchVillage(query) {
    if (!query) return;
    const v = HIMAGUARD_DATA.villages.find(x => x.name.toLowerCase().includes(query.toLowerCase()));
    if (v && this.map) {
      this.map.flyTo(v.coordinates, 14, { duration: 1.2 });
      if (this.villageMarkers[v.id]) {
        this.villageMarkers[v.id].openPopup();
      }
    }
  }

  renderCanvasFallback(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
      <div style="background:#070b13; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#94a3b8; font-size:13px; text-align:center; padding:1rem;">
        <div style="font-size:2rem; margin-bottom:8px;">🛰️</div>
        <strong style="color:#38bdf8;">HIMAGUARD GIS TERRAIN RADAR</strong>
        <p style="font-size:11px; max-width:320px; margin-top:4px;">Mandakini & Alaknanda Catchment Active • 12 Village Nodes Monitored</p>
      </div>
    `;
  }
}

window.himaGuardMap = new HimaGuardMap();
