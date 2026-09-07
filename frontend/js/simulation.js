/**
 * HimaGuard: Flash Flood Simulation & SIH Presentation Demo Controller
 * SIH 2026 Problem Statement SIH26192
 * 
 * Drives the live 5-stage critical flash flood progression sequence:
 * Rainfall: 20 -> 45 -> 72 -> 105 -> 120 mm/hr
 * Soil moisture: 55 -> 68 -> 82 -> 91 -> 95%
 * Water level: 1.2 -> 1.6 -> 2.4 -> 2.9 -> 3.4 m
 * Risk: LOW -> MODERATE -> HIGH -> VERY HIGH -> CRITICAL
 * Village Color: GREEN -> YELLOW -> ORANGE -> RED
 */

class HimaGuardSimulation {
  constructor() {
    this.isDemoMode = true; // Default to demo mode for SIH presentation ease
    this.isSimulating = false;
    this.currentSimStep = 0;
    this.audioAlertEnabled = true;
    this.audioCtx = null;
    this.replayInterval = null;
  }

  init() {
    this.bindControls();
  }

  bindControls() {
    const modeSwitch = document.getElementById('demoModeToggle');
    if (modeSwitch) {
      modeSwitch.addEventListener('change', (e) => {
        this.isDemoMode = e.target.checked;
        this.updateModeUI();
      });
    }

    const chimeBtn = document.getElementById('btnAlertChime');
    if (chimeBtn) {
      chimeBtn.addEventListener('click', () => {
        this.audioAlertEnabled = !this.audioAlertEnabled;
        chimeBtn.innerHTML = this.audioAlertEnabled ? '🔔 Alert Chime: ON' : '🔕 Alert Chime: OFF';
        chimeBtn.classList.toggle('btn-outline', this.audioAlertEnabled);
        chimeBtn.classList.toggle('btn-secondary', !this.audioAlertEnabled);
      });
    }
  }

  updateModeUI() {
    const indicator = document.getElementById('systemModeIndicator');
    const simBtn = document.getElementById('btnLaunchFloodSim');
    if (indicator) {
      indicator.textContent = this.isDemoMode ? 'MODE: DEMO / SIH SIMULATION' : 'MODE: LIVE TELEMETRY STREAM';
      indicator.className = this.isDemoMode ? 'system-mode-tag mode-demo' : 'system-mode-tag mode-live';
    }
    if (simBtn) {
      simBtn.style.display = this.isDemoMode ? 'inline-flex' : 'none';
    }
  }

  playEmergencyChime() {
    if (!this.audioAlertEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) this.audioCtx = new AudioContext();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, this.audioCtx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.7);
    } catch (e) {
      console.log('Audio tone notice:', e);
    }
  }

  /**
   * Run the SIH 2-3 minute Flash Flood Simulation on Bhairavpur
   */
  startFlashFloodSimulation() {
    if (this.isSimulating) return;
    this.isSimulating = true;
    this.currentSimStep = 1;

    const simBtn = document.getElementById('btnLaunchFloodSim');
    if (simBtn) {
      simBtn.disabled = true;
      simBtn.innerHTML = '⏳ Simulating Catchment Surge...';
      simBtn.classList.add('pulse-critical');
    }

    const bhairavpur = HIMAGUARD_DATA.villages.find(v => v.id === 'VIL-001');
    if (!bhairavpur) return;

    // Progression stages
    const stages = [
      { step: 1, rain: 20, soil: 55, water: 1.20, status: 'Low', prob: 20, label: 'Stage 1: Normal Inflow (Green)' },
      { step: 2, rain: 45, soil: 68, water: 1.60, status: 'Moderate', prob: 48, label: 'Stage 2: Rainfall Accelerating (Yellow)' },
      { step: 3, rain: 72, soil: 82, water: 2.40, status: 'High', prob: 75, label: 'Stage 3: Heavy Runoff Approaching (Orange)' },
      { step: 4, rain: 105, soil: 91, water: 2.90, status: 'High', prob: 88, label: 'Stage 4: Cloudburst Inundation Rising' },
      { step: 5, rain: 120, soil: 95, water: 3.40, status: 'Critical', prob: 94, label: 'Stage 5: CRITICAL FLASH FLOOD BREACH (Red)' }
    ];

    let currentIdx = 0;

    const executeStage = () => {
      if (currentIdx >= stages.length) {
        // Complete
        this.isSimulating = false;
        if (simBtn) {
          simBtn.disabled = false;
          simBtn.innerHTML = '⚡ SIMULATE FLASH FLOOD';
          simBtn.classList.remove('pulse-critical');
        }
        return;
      }

      const st = stages[currentIdx];
      this.currentSimStep = st.step;

      // Update Bhairavpur data
      bhairavpur.sensors.rainGauge = st.rain;
      bhairavpur.sensors.soilMoisture = st.soil;
      bhairavpur.sensors.waterLevel = st.water;
      bhairavpur.sensors.waterLevelChange = `+${Math.round((st.water - 1.2) * 20)} cm / 10 min`;
      bhairavpur.status = st.status;
      bhairavpur.floodProbability = st.prob;
      bhairavpur.estimatedLeadTime = Math.max(30, Math.round(70 - (st.step * 7)));

      // Recalculate AI Risk Engine
      const assessment = HimaGuardRiskEngine.evaluate(bhairavpur);
      bhairavpur.riskFactors = assessment.riskFactors;
      bhairavpur.aiReasons = assessment.aiReasons;

      // Update Map Marker
      if (window.himaGuardMap) {
        window.himaGuardMap.updateVillageMarker('VIL-001', st.status, st.prob);
      }

      // Update Charts
      if (window.himaGuardCharts) {
        window.himaGuardCharts.updateVillageCharts(bhairavpur);
      }

      // Update Global UI
      if (window.himaGuardApp) {
        window.himaGuardApp.refreshDashboardMetrics();
        window.himaGuardApp.renderEarlyWarningBanner(bhairavpur);
        window.himaGuardApp.showToast(`SIH Simulation [${st.step}/5]: ${st.label}`, st.status === 'Critical' ? 'error' : (st.status === 'High' ? 'warning' : 'info'));
      }

      // Audio alarm on Critical stage
      if (st.status === 'Critical' || st.step >= 4) {
        this.playEmergencyChime();
      }

      currentIdx++;
      if (currentIdx < stages.length) {
        setTimeout(executeStage, 1400); // 1.4s interval per stage
      } else {
        // Trigger simulated emergency alert at the end
        setTimeout(() => {
          this.triggerSimulatedEmergencyAlert(bhairavpur);
          this.isSimulating = false;
          if (simBtn) {
            simBtn.disabled = false;
            simBtn.innerHTML = '⚡ SIMULATE FLASH FLOOD';
            simBtn.classList.remove('pulse-critical');
          }
        }, 800);
      }
    };

    executeStage();
  }

  /**
   * Reset simulation back to initial baseline
   */
  resetSimulation() {
    const v = HIMAGUARD_DATA.villages.find(x => x.id === 'VIL-001');
    if (!v) return;

    v.sensors.rainGauge = 74.0;
    v.sensors.soilMoisture = 86.0;
    v.sensors.waterLevel = 2.80;
    v.status = 'Critical';
    v.floodProbability = 87;
    v.estimatedLeadTime = 42;

    if (window.himaGuardMap) {
      window.himaGuardMap.updateVillageMarker('VIL-001', 'Critical', 87);
    }
    if (window.himaGuardApp) {
      window.himaGuardApp.refreshDashboardMetrics();
      window.himaGuardApp.renderEarlyWarningBanner(v);
      window.himaGuardApp.showToast('Simulation reset to baseline state.', 'info');
    }
  }

  /**
   * Trigger Simulated Emergency Alert Modal
   */
  triggerSimulatedEmergencyAlert(village) {
    const modal = document.getElementById('modalEmergencyBroadcast');
    if (!modal) return;

    document.getElementById('broadcastTargetVillage').textContent = village.name;
    document.getElementById('broadcastProbability').textContent = `${village.floodProbability}%`;
    document.getElementById('broadcastLeadTime').textContent = `${village.estimatedLeadTime} minutes`;
    document.getElementById('broadcastAction').textContent = 'Move residents from low-lying riverside settlement (Wards 1 & 2) immediately toward ZP Inter College Elevated Campus.';
    document.getElementById('broadcastRecipients').textContent = `${village.population.toLocaleString()} Residents`;

    modal.classList.add('active');
  }

  /**
   * Historical Event Replay Runner (Section 13)
   */
  startHistoricalReplay() {
    const steps = HIMAGUARD_DATA.replaySteps;
    let stepIdx = 0;

    const btn = document.getElementById('btnStartReplay');
    if (btn) btn.disabled = true;

    if (this.replayInterval) clearInterval(this.replayInterval);

    const updateStep = () => {
      if (stepIdx >= steps.length) {
        clearInterval(this.replayInterval);
        if (btn) btn.disabled = false;
        return;
      }

      const st = steps[stepIdx];

      // Update replay UI elements
      const elStage = document.getElementById('replayCurrentStage');
      const elRain = document.getElementById('replayRainVal');
      const elSoil = document.getElementById('replaySoilVal');
      const elWater = document.getElementById('replayWaterVal');
      const elProb = document.getElementById('replayProbVal');
      const elRiskBadge = document.getElementById('replayRiskBadge');
      const elAction = document.getElementById('replayActionText');
      const elProgress = document.getElementById('replayProgressBar');

      if (elStage) elStage.textContent = `${st.name} (${st.timeLabel})`;
      if (elRain) elRain.textContent = `${st.rain} mm/h`;
      if (elSoil) elSoil.textContent = `${st.soil}%`;
      if (elWater) elWater.textContent = `${st.water.toFixed(2)} m`;
      if (elProb) elProb.textContent = `${st.prob}%`;
      if (elAction) elAction.textContent = st.action;

      if (elRiskBadge) {
        elRiskBadge.textContent = st.risk.toUpperCase();
        elRiskBadge.style.backgroundColor = st.riskColor + '22';
        elRiskBadge.style.color = st.riskColor;
        elRiskBadge.style.borderColor = st.riskColor;
      }

      if (elProgress) {
        elProgress.style.width = `${((stepIdx + 1) / steps.length) * 100}%`;
      }

      // Step highlights on timeline
      document.querySelectorAll('.replay-step-node').forEach((node, idx) => {
        node.classList.toggle('active', idx === stepIdx);
        node.classList.toggle('completed', idx < stepIdx);
      });

      stepIdx++;
    };

    updateStep();
    this.replayInterval = setInterval(updateStep, 1500);
  }
}

window.himaGuardSimulation = new HimaGuardSimulation();
