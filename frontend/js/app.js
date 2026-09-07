/**
 * HimaGuard: Main Application Orchestrator & View Controller
 * SIH 2026 Problem Statement SIH26192
 */

class HimaGuardApp {
  constructor() {
    this.currentUser = {
      name: 'Dr. Rajesh Semwal',
      role: 'Disaster Authority', // Disaster Authority, Emergency Operator, Administrator, Citizen
      email: 'authority@himaguard.gov.in',
      isLoggedIn: true
    };
    this.currentView = 'dashboard';
    this.selectedVillageId = 'VIL-001'; // Default Bhairavpur
    this.selectedSensorId = 'UTK001';
  }

  init() {
    this.checkAuth();
    this.bindNavigation();
    this.startClock();
    this.renderDashboard();
    this.renderVillagesTable();
    this.renderSensorsTable();
    this.renderAlertsTable();
    this.renderHistoricalEvents();
    this.renderAnalytics();
    this.setupModals();
    this.setupForms();

    // Check backend connection
    window.himaGuardAPI.checkBackendHealth().then(online => {
      const tag = document.getElementById('backendStatusTag');
      if (tag) {
        tag.textContent = online ? 'API: PYTHON BACKEND (ONLINE)' : 'API: MOCK / CLIENT SERVICE (READY)';
        tag.className = online ? 'system-status-indicator' : 'system-status-indicator badge-secondary';
      }
    });

    // Initialize subsystems after DOM is ready
    setTimeout(() => {
      if (window.himaGuardMap) window.himaGuardMap.init();
      if (window.himaGuardCharts) window.himaGuardCharts.init();
      if (window.himaGuardSimulation) window.himaGuardSimulation.init();
    }, 150);
  }

  checkAuth() {
    const loginOverlay = document.getElementById('loginOverlay');
    if (!this.currentUser.isLoggedIn) {
      if (loginOverlay) loginOverlay.classList.remove('hidden');
    } else {
      if (loginOverlay) loginOverlay.classList.add('hidden');
      this.updateUserUI();
    }
  }

  demoLogin(role) {
    this.currentUser = {
      name: role === 'Disaster Authority' ? 'Dr. Rajesh Semwal (Director SDMA)' :
            (role === 'Emergency Operator' ? 'Pooja Rawat (District EOC)' :
            (role === 'Administrator' ? 'System Admin (IoT/ML Core)' : 'Citizen (Bhairavpur)')),
      role: role,
      email: `${role.toLowerCase().replace(' ', '')}@himaguard.gov.in`,
      isLoggedIn: true
    };
    this.checkAuth();
    this.showToast(`Logged in successfully as ${role}`, 'info');

    if (role === 'Citizen') {
      window.location.href = 'citizen.html';
    }
  }

  logout() {
    this.currentUser.isLoggedIn = false;
    this.checkAuth();
  }

  updateUserUI() {
    const userRoleEl = document.getElementById('userRoleDisplay');
    const userNameEl = document.getElementById('userNameDisplay');
    if (userRoleEl) userRoleEl.textContent = this.currentUser.role.toUpperCase();
    if (userNameEl) userNameEl.textContent = this.currentUser.name;
  }

  bindNavigation() {
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        if (view) this.switchView(view);
      });
    });

    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-go-view]');
      if (target) {
        e.preventDefault();
        const view = target.getAttribute('data-go-view');
        this.switchView(view);
      }
    });
  }

  switchView(viewName) {
    this.currentView = viewName;

    // Update active nav link
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });

    // Update view container
    document.querySelectorAll('.app-view').forEach(view => {
      view.classList.toggle('active', view.id === `view-${viewName}`);
    });

    // Refresh charts or map layout if needed
    if (viewName === 'map' && window.himaGuardMap && window.himaGuardMap.map) {
      setTimeout(() => window.himaGuardMap.map.invalidateSize(), 200);
    }
    if (viewName === 'predictions' && window.himaGuardCharts) {
      setTimeout(() => {
        window.himaGuardCharts.renderMultiParamChart();
        window.himaGuardCharts.renderPredictionTrendChart();
      }, 150);
    }
    if (viewName === 'analytics' && window.himaGuardCharts) {
      setTimeout(() => window.himaGuardCharts.renderAnalyticsCharts(), 150);
    }
    if (viewName === 'village-details') {
      this.renderVillageDetails(this.selectedVillageId);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startClock() {
    const update = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
      const el = document.getElementById('liveClockDisplay');
      if (el) el.innerHTML = `<span class="font-bold text-white">${timeStr} IST</span> <span class="text-slate-400">| ${dateStr}</span>`;
    };
    update();
    setInterval(update, 1000);
  }

  renderDashboard() {
    this.refreshDashboardMetrics();
    this.renderDashboardVillageGrid();
    
    // Check initial critical banner for Bhairavpur
    const bhairavpur = HIMAGUARD_DATA.villages.find(v => v.id === 'VIL-001');
    if (bhairavpur) {
      this.renderEarlyWarningBanner(bhairavpur);
    }
  }

  refreshDashboardMetrics() {
    let total = HIMAGUARD_DATA.villages.length;
    let critical = 0;
    let high = 0;
    let popRisk = 0;

    HIMAGUARD_DATA.villages.forEach(v => {
      if (v.status === 'Critical') {
        critical++;
        popRisk += v.population;
      } else if (v.status === 'High') {
        high++;
        popRisk += Math.round(v.population * 0.6);
      }
    });

    const elTotal = document.getElementById('statTotalVillages');
    const elCrit = document.getElementById('statCriticalCount');
    const elHigh = document.getElementById('statHighRiskCount');
    const elPop = document.getElementById('statAffectedPop');
    const elAlerts = document.getElementById('statActiveAlerts');

    if (elTotal) elTotal.textContent = total.toString().padStart(2, '0');
    if (elCrit) elCrit.textContent = critical.toString().padStart(2, '0');
    if (elHigh) elHigh.textContent = high.toString().padStart(2, '0');
    if (elPop) elPop.textContent = popRisk.toLocaleString();
    if (elAlerts) elAlerts.textContent = HIMAGUARD_DATA.alerts.filter(a => a.status === 'ACTIVE').length.toString().padStart(2, '0');
  }

  renderEarlyWarningBanner(village) {
    const banner = document.getElementById('earlyWarningBannerContainer');
    if (!banner) return;

    const isCrit = village.status === 'Critical';
    const isHigh = village.status === 'High';

    if (!isCrit && !isHigh) {
      banner.classList.add('hidden');
      return;
    }

    banner.classList.remove('hidden');
    banner.innerHTML = `
      <div class="warning-banner-card ${isCrit ? 'border-critical pulse-critical' : 'border-high'}">
        <div class="warning-banner-left">
          <div class="warning-header-tag">
            <span class="warning-icon">🚨</span>
            <span class="warning-pill ${isCrit ? 'bg-rose-500' : 'bg-orange-500'}">
              ${isCrit ? 'CRITICAL FLASH FLOOD WARNING' : 'HIGH RISK SEVERE INUNDATION WATCH'}
            </span>
          </div>
          <h2 class="warning-title">${village.name} (${village.district} District)</h2>
          <div class="warning-lead-time">
            ⏳ ESTIMATED ACTIONABLE LEAD TIME: <strong class="text-white bg-red-900/60 px-2 py-0.5 rounded border border-red-500/40">${village.estimatedLeadTime} MINUTES</strong>
          </div>
          <p class="warning-text">
            Mandakini gorge river level surging at <strong>${village.sensors.waterLevelChange}</strong>. Catchment soil saturation at <strong>${village.sensors.soilMoisture}%</strong>.
            Recommended Action: <strong>${village.evacuation.recommendedDirection}</strong>.
          </p>
          <div class="warning-reasons-chips">
            ${village.aiReasons.slice(0, 3).map(r => `<span>✓ ${r}</span>`).join('')}
          </div>
        </div>

        <div class="warning-banner-right">
          <button class="btn btn-danger btn-lg pulse-button" onclick="window.himaGuardSimulation.triggerSimulatedEmergencyAlert(HIMAGUARD_DATA.villages.find(v => v.id === '${village.id}'))">
            📢 DISPATCH EMERGENCY ALERT
          </button>
          <button class="btn btn-outline" onclick="window.himaGuardApp.openVillageDetails('${village.id}')">
            📊 View Risk Factor Decomposition
          </button>
          <button class="btn btn-outline" onclick="window.himaGuardApp.inspectOnMap('${village.id}')">
            🗺️ View Inundation Map & Evac Route
          </button>
        </div>
      </div>
    `;
  }

  renderDashboardVillageGrid() {
    const grid = document.getElementById('dashboardVillagesGrid');
    if (!grid) return;

    grid.innerHTML = HIMAGUARD_DATA.villages.map(v => {
      const badgeClass = `badge-${v.status.toLowerCase()}`;
      return `
        <div class="village-summary-card border-top-${v.status.toLowerCase()}">
          <div class="v-card-top">
            <div>
              <h4 class="v-card-name">${v.name}</h4>
              <span class="v-card-sub">${v.district} • ${v.elevation}</span>
            </div>
            <span class="status-badge ${badgeClass}">${v.status.toUpperCase()}</span>
          </div>

          <div class="v-metrics-grid">
            <div class="vm-item">
              <span class="vm-lbl">Probability</span>
              <strong class="vm-val font-${v.status.toLowerCase()}">${v.floodProbability}%</strong>
            </div>
            <div class="vm-item">
              <span class="vm-lbl">Lead Time</span>
              <strong class="vm-val text-rose-400">${v.estimatedLeadTime}m</strong>
            </div>
            <div class="vm-item">
              <span class="vm-lbl">Rainfall</span>
              <strong class="vm-val text-sky-400">${v.sensors.rainGauge} <small>mm/h</small></strong>
            </div>
            <div class="vm-item">
              <span class="vm-lbl">River Level</span>
              <strong class="vm-val text-amber-400">${v.sensors.waterLevel}m</strong>
            </div>
          </div>

          <div class="v-card-actions">
            <button class="btn btn-sm btn-outline" onclick="window.himaGuardApp.openVillageDetails('${v.id}')">
              Details →
            </button>
            <button class="btn btn-sm btn-ghost" onclick="window.himaGuardApp.inspectOnMap('${v.id}')">
              🗺️ Map
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderVillagesTable(filterStatus = 'All', searchQuery = '') {
    const tbody = document.getElementById('villagesTableBody');
    if (!tbody) return;

    let list = HIMAGUARD_DATA.villages;
    if (filterStatus !== 'All') {
      list = list.filter(v => v.status.toLowerCase() === filterStatus.toLowerCase());
    }
    if (searchQuery) {
      list = list.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.district.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    tbody.innerHTML = list.map(v => `
      <tr onclick="window.himaGuardApp.openVillageDetails('${v.id}')" style="cursor:pointer;">
        <td><strong>${v.name}</strong></td>
        <td>${v.district}</td>
        <td><span class="status-badge badge-${v.status.toLowerCase()}">${v.status.toUpperCase()}</span></td>
        <td><strong class="font-${v.status.toLowerCase()}">${v.floodProbability}%</strong></td>
        <td><span class="lead-time-pill">${v.estimatedLeadTime} min</span></td>
        <td>${v.population.toLocaleString()}</td>
        <td><span class="text-emerald-400 font-mono">${v.sensorsOnline}</span></td>
        <td class="text-slate-400 text-xs">${v.lastUpdate}</td>
      </tr>
    `).join('');
  }

  renderVillageDetails(villageId) {
    const v = HIMAGUARD_DATA.villages.find(x => x.id === villageId) || HIMAGUARD_DATA.villages[0];
    this.selectedVillageId = v.id;

    const container = document.getElementById('villageDetailsContent');
    if (!container) return;

    container.innerHTML = `
      <div class="village-details-header border-top-${v.status.toLowerCase()}">
        <div class="vd-title-group">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <h2 style="font-size:1.6rem; font-weight:800; color:#fff;">${v.name}</h2>
            <span class="status-badge badge-${v.status.toLowerCase()}">${v.status.toUpperCase()}</span>
          </div>
          <p class="text-slate-400 text-sm">
            ${v.district} District • Coordinates: [${v.coordinates.join(', ')}] • River Basin: <strong>${v.nearbyRiver}</strong>
          </p>
        </div>

        <div class="vd-stat-pills">
          <div class="vd-pill">
            <span class="vd-lbl">Flood Probability</span>
            <span class="vd-val font-${v.status.toLowerCase()}">${v.floodProbability}%</span>
          </div>
          <div class="vd-pill">
            <span class="vd-lbl">Estimated Lead Time</span>
            <span class="vd-val text-rose-400">${v.estimatedLeadTime} min</span>
          </div>
          <div class="vd-pill">
            <span class="vd-lbl">Confidence</span>
            <span class="vd-val text-sky-400">${(v.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <!-- Grid 2-Column: Geography & Risk Factor Decomposition -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <!-- Physical & Topographical Profile -->
        <div class="cmd-card">
          <h3 class="cmd-card-title">🏔️ Topographical & Catchment Terrain Profile</h3>
          <div class="geo-profile-grid">
            <div class="gp-item"><span>Elevation:</span> <strong>${v.elevation}</strong></div>
            <div class="gp-item"><span>Slope Gradient:</span> <strong>${v.slope}</strong></div>
            <div class="gp-item"><span>Nearby River:</span> <strong>${v.nearbyRiver}</strong></div>
            <div class="gp-item"><span>Distance to Channel:</span> <strong>${v.distanceToRiver}</strong></div>
            <div class="gp-item"><span>Population:</span> <strong>${v.population.toLocaleString()} (${v.households} homes)</strong></div>
            <div class="gp-item"><span>Landslide Hazard:</span> <strong class="text-orange-400">${v.landslideRisk}</strong></div>
            <div class="gp-item"><span>Historical Floods:</span> <strong>${v.historicalFloodCount} Events</strong></div>
            <div class="gp-item"><span>Historical Landslides:</span> <strong>${v.historicalLandslideCount} Events</strong></div>
          </div>

          <h4 style="font-size:0.85rem; font-weight:700; color:#cbd5e1; margin:1rem 0 0.5rem 0;">Real-Time Sensor Telemetry</h4>
          <div class="grid grid-cols-3 gap-2">
            <div class="bg-black/30 p-2 rounded text-center border border-white/5">
              <span class="text-xs text-slate-400 block">Rainfall</span>
              <strong class="text-sky-400">${v.sensors.rainGauge} mm/h</strong>
            </div>
            <div class="bg-black/30 p-2 rounded text-center border border-white/5">
              <span class="text-xs text-slate-400 block">Soil Moisture</span>
              <strong class="text-emerald-400">${v.sensors.soilMoisture}%</strong>
            </div>
            <div class="bg-black/30 p-2 rounded text-center border border-white/5">
              <span class="text-xs text-slate-400 block">River Level</span>
              <strong class="text-rose-400">${v.sensors.waterLevel} m</strong>
            </div>
          </div>
        </div>

        <!-- Risk Factor Breakdown -->
        <div class="cmd-card">
          <h3 class="cmd-card-title">📊 Multi-Source Risk Factor Decomposition</h3>
          <div class="factors-decomp-list">
            <div class="factor-bar-row">
              <div class="fb-meta"><span>Rainfall Intensity</span><strong>${v.riskFactors.rainfallRisk}%</strong></div>
              <div class="fb-track"><div class="fb-fill bg-sky-500" style="width:${v.riskFactors.rainfallRisk}%"></div></div>
            </div>
            <div class="factor-bar-row">
              <div class="fb-meta"><span>Soil Moisture Saturation</span><strong>${v.riskFactors.soilSaturation}%</strong></div>
              <div class="fb-track"><div class="fb-fill bg-emerald-500" style="width:${v.riskFactors.soilSaturation}%"></div></div>
            </div>
            <div class="factor-bar-row">
              <div class="fb-meta"><span>River Water Level Surge</span><strong>${v.riskFactors.waterLevelRisk}%</strong></div>
              <div class="fb-track"><div class="fb-fill bg-rose-500" style="width:${v.riskFactors.waterLevelRisk}%"></div></div>
            </div>
            <div class="factor-bar-row">
              <div class="fb-meta"><span>Slope & Topography Gradient</span><strong>${v.riskFactors.slopeRisk}%</strong></div>
              <div class="fb-track"><div class="fb-fill bg-amber-500" style="width:${v.riskFactors.slopeRisk}%"></div></div>
            </div>
            <div class="factor-bar-row">
              <div class="fb-meta"><span>Historical Inundation Vulnerability</span><strong>${v.riskFactors.historicalRisk}%</strong></div>
              <div class="fb-track"><div class="fb-fill bg-indigo-500" style="width:${v.riskFactors.historicalRisk}%"></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Explanation Card -->
      <div class="cmd-card my-4 border-l-4 border-l-cyan-500">
        <h3 class="cmd-card-title text-cyan-400">🤖 AI Decision Rationale: WHY IS THE RISK HIGH?</h3>
        <ul class="ai-rationale-list">
          ${v.aiReasons.map(r => `<li><span class="text-emerald-400 font-bold mr-2">✓</span> ${r}</li>`).join('')}
        </ul>
      </div>

      <!-- Evacuation & Response Module -->
      <div class="cmd-card my-4">
        <h3 class="cmd-card-title text-emerald-400">🛡️ Evacuation & Civil Defense Response Operations</h3>
        <div class="evac-info-grid">
          <div>
            <span class="text-slate-400 text-xs uppercase block">Vulnerable Zones:</span>
            <strong class="text-white">${v.evacuation.affectedZones}</strong>
          </div>
          <div>
            <span class="text-slate-400 text-xs uppercase block">Potentially Affected Population:</span>
            <strong class="text-rose-400">${v.evacuation.affectedPopulation} Residents</strong>
          </div>
          <div>
            <span class="text-slate-400 text-xs uppercase block">Recommended Evacuation Direction:</span>
            <strong class="text-emerald-400">${v.evacuation.recommendedDirection}</strong>
          </div>
        </div>

        <h4 style="font-size:0.85rem; font-weight:700; color:#cbd5e1; margin:1rem 0 0.5rem 0;">Designated High-Ground Safe Shelters</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          ${v.evacuation.shelters.map(sh => `
            <div class="bg-black/30 p-3 rounded border border-white/5 flex justify-between items-center">
              <div>
                <strong class="text-white">${sh.name}</strong>
                <div class="text-xs text-slate-400">Capacity: ${sh.capacity} persons • Distance: ${sh.distance} (Elev: ${sh.elevation})</div>
              </div>
              <span class="status-badge badge-low">${sh.status}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display:flex; gap:1rem; margin-top:1.5rem;">
        <button class="btn btn-danger btn-lg" onclick="window.himaGuardSimulation.triggerSimulatedEmergencyAlert(HIMAGUARD_DATA.villages.find(v => v.id === '${v.id}'))">
          📢 Broadcast Emergency Alert for ${v.name}
        </button>
        <button class="btn btn-outline" onclick="window.himaGuardApp.inspectOnMap('${v.id}')">
          🗺️ Locate on Geospatial Map
        </button>
      </div>
    `;
  }

  openVillageDetails(villageId) {
    this.selectedVillageId = villageId;
    this.switchView('village-details');
  }

  inspectOnMap(villageId) {
    this.selectedVillageId = villageId;
    this.switchView('map');
    if (window.himaGuardMap) {
      window.himaGuardMap.searchVillage(HIMAGUARD_DATA.villages.find(v => v.id === villageId)?.name || '');
    }
  }

  renderSensorsTable(filterType = 'All') {
    const tbody = document.getElementById('sensorsTableBody');
    if (!tbody) return;

    let list = HIMAGUARD_DATA.sensors;
    if (filterType !== 'All') {
      list = list.filter(s => s.type.toLowerCase().includes(filterType.toLowerCase()));
    }

    tbody.innerHTML = list.map(s => {
      const isOnline = s.status === 'ONLINE';
      const statusClass = isOnline ? 'badge-low' : (s.status === 'WARNING' ? 'badge-moderate' : 'badge-critical');
      const batteryColor = s.battery > 50 ? 'text-emerald-400' : (s.battery > 20 ? 'text-amber-400' : 'text-rose-400');

      return `
        <tr onclick="window.himaGuardApp.openSensorDrawer('${s.id}')" style="cursor:pointer;">
          <td><strong class="font-mono text-sky-400">${s.id}</strong></td>
          <td>${s.type}</td>
          <td><strong>${s.village}</strong></td>
          <td class="font-bold text-white">${s.value}</td>
          <td><span class="${batteryColor} font-mono">${s.battery}%</span></td>
          <td>${s.signal}</td>
          <td class="text-slate-400 text-xs">${s.lastUpdated}</td>
          <td><span class="status-badge ${statusClass}">${s.status}</span></td>
        </tr>
      `;
    }).join('');
  }

  openSensorDrawer(sensorId) {
    const s = HIMAGUARD_DATA.sensors.find(x => x.id === sensorId);
    if (!s) return;
    this.selectedSensorId = s.id;

    const drawer = document.getElementById('sensorDrawerModal');
    const content = document.getElementById('sensorDrawerContent');
    if (!drawer || !content) return;

    content.innerHTML = `
      <div style="border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:1rem; margin-bottom:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <span class="status-badge ${s.status === 'ONLINE' ? 'badge-low' : 'badge-critical'}">${s.status}</span>
            <h3 style="font-size:1.3rem; font-weight:800; color:#fff; margin-top:4px;">${s.type} [${s.id}]</h3>
            <p class="text-slate-400 text-xs">${s.village} Station • Coordinates: [${s.coordinates.join(', ')}]</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.6rem; font-weight:900; color:#38bdf8;">${s.value}</div>
            <span class="text-slate-400 text-xs">Current Reading</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 my-3">
        <div class="bg-black/30 p-2.5 rounded border border-white/5">
          <span class="text-xs text-slate-400">Battery Level:</span>
          <strong class="text-white block">${s.battery}% (LiFePO4 Solar Backed)</strong>
        </div>
        <div class="bg-black/30 p-2.5 rounded border border-white/5">
          <span class="text-xs text-slate-400">Signal Strength:</span>
          <strong class="text-white block">${s.signal} (4G / LoRaWAN Mesh)</strong>
        </div>
        <div class="bg-black/30 p-2.5 rounded border border-white/5">
          <span class="text-xs text-slate-400">Sampling Rate:</span>
          <strong class="text-white block">10 Seconds Continuous</strong>
        </div>
        <div class="bg-black/30 p-2.5 rounded border border-white/5">
          <span class="text-xs text-slate-400">Last Telemetry Ping:</span>
          <strong class="text-white block">${s.lastUpdated}</strong>
        </div>
      </div>

      <h4 style="font-size:0.85rem; font-weight:700; color:#cbd5e1; margin:1rem 0 0.5rem 0;">24-Hour Telemetry Reading History</h4>
      <div style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:12px; height:180px; position:relative;">
        <canvas id="sensorDrawerChart"></canvas>
      </div>
    `;

    drawer.classList.add('active');

    // Draw sparkline chart in drawer
    setTimeout(() => {
      const canvas = document.getElementById('sensorDrawerChart');
      if (canvas && typeof Chart !== 'undefined') {
        new Chart(canvas.getContext('2d'), {
          type: 'line',
          data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
            datasets: [{
              label: s.type,
              data: [s.numericValue * 0.4, s.numericValue * 0.5, s.numericValue * 0.65, s.numericValue * 0.8, s.numericValue * 0.95, s.numericValue * 0.98, s.numericValue],
              borderColor: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              fill: true,
              tension: 0.3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { grid: { color: 'rgba(255,255,255,0.05)' } },
              x: { grid: { color: 'rgba(255,255,255,0.05)' } }
            }
          }
        });
      }
    }, 100);
  }

  renderAlertsTable() {
    const tbody = document.getElementById('alertsTableBody');
    if (!tbody) return;

    tbody.innerHTML = HIMAGUARD_DATA.alerts.map(a => `
      <tr>
        <td><span class="status-badge ${a.badgeClass}">${a.severity.toUpperCase()}</span></td>
        <td><strong>${a.title}</strong><div class="text-xs text-slate-400">${a.zone}</div></td>
        <td><strong>${a.village}</strong></td>
        <td><strong class="font-${a.severity.toLowerCase()}">${a.probability}%</strong></td>
        <td><span class="lead-time-pill">${a.leadTime}</span></td>
        <td class="text-xs text-slate-300">${a.time}</td>
        <td>
          <span class="status-badge ${a.status === 'ACTIVE' ? 'badge-critical' : 'badge-low'}">${a.status}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="window.himaGuardApp.acknowledgeAlert('${a.id}')">
            ${a.status === 'ACKNOWLEDGED' ? '✓ Acknowledged' : 'Acknowledge'}
          </button>
        </td>
      </tr>
    `).join('');
  }

  acknowledgeAlert(alertId) {
    window.himaGuardAPI.acknowledgeAlert(alertId);
    this.renderAlertsTable();
    this.showToast('Alert status updated to ACKNOWLEDGED.', 'info');
  }

  renderHistoricalEvents() {
    const tbody = document.getElementById('eventsTableBody');
    if (!tbody) return;

    tbody.innerHTML = HIMAGUARD_DATA.historicalEvents.map(e => `
      <tr>
        <td><strong>${e.date}</strong></td>
        <td><strong>${e.location}</strong></td>
        <td><span class="event-tag">${e.eventType}</span></td>
        <td>${e.rainfall}</td>
        <td><span class="status-badge badge-${e.severity.toLowerCase()}">${e.severity}</span></td>
        <td>${e.waterLevel}</td>
        <td class="text-xs text-slate-300">${e.impact}</td>
      </tr>
    `).join('');
  }

  renderAnalytics() {
    const m = HIMAGUARD_DATA.mlModelMetrics;
    const elAcc = document.getElementById('mlMetricAccuracy');
    const elPrec = document.getElementById('mlMetricPrecision');
    const elRec = document.getElementById('mlMetricRecall');
    const elF1 = document.getElementById('mlMetricF1');
    const elAuc = document.getElementById('mlMetricAuc');

    if (elAcc) elAcc.textContent = `${m.accuracy}%`;
    if (elPrec) elPrec.textContent = `${m.precision}%`;
    if (elRec) elRec.textContent = `${m.recall}%`;
    if (elF1) elF1.textContent = `${m.f1Score}%`;
    if (elAuc) elAuc.textContent = m.rocAuc.toString();
  }

  setupModals() {
    // Close on any modal close button
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(m => {
      m.addEventListener('click', (e) => {
        if (e.target === m) m.classList.remove('active');
      });
    });
  }

  setupForms() {
    // Alert creation form submit
    const alertForm = document.getElementById('createAlertForm');
    if (alertForm) {
      alertForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const payload = {
          title: document.getElementById('formAlertTitle').value,
          severity: document.getElementById('formAlertSeverity').value,
          village: document.getElementById('formAlertVillage').value,
          zone: document.getElementById('formAlertZone').value,
          recommendedAction: document.getElementById('formAlertAction').value,
          leadTime: document.getElementById('formAlertLeadTime').value,
          probability: parseInt(document.getElementById('formAlertProb').value) || 85
        };

        window.himaGuardAPI.createAlert(payload);
        this.renderAlertsTable();
        this.refreshDashboardMetrics();
        document.getElementById('modalCreateAlert').classList.remove('active');
        this.showToast(`Emergency alert dispatched for ${payload.village}!`, 'error');
      });
    }

    // Village search
    const villageSearch = document.getElementById('villageSearchInput');
    if (villageSearch) {
      villageSearch.addEventListener('input', (e) => {
        this.renderVillagesTable('All', e.target.value);
      });
    }

    // Map village search
    const mapSearch = document.getElementById('mapSearchInput');
    if (mapSearch) {
      mapSearch.addEventListener('input', (e) => {
        if (window.himaGuardMap) window.himaGuardMap.searchVillage(e.target.value);
      });
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'error' ? '🚨' : (type === 'warning' ? '⚠️' : '✓')}</span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.himaGuardApp = new HimaGuardApp();
  window.himaGuardApp.init();
});
