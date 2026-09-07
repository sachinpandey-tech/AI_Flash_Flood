/**
 * HimaGuard: API Service Abstraction Layer
 * SIH 2026 Problem Statement SIH26192
 * 
 * Provides unified interface for REST API communication with fallback to local mock data.
 */

class HimaGuardAPI {
  constructor(baseUrl = 'http://localhost:8000/api') {
    this.baseUrl = baseUrl;
    this.isBackendOnline = false;
  }

  async checkBackendHealth() {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { method: 'GET', signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        this.isBackendOnline = true;
        console.log('HimaGuard Python Backend Connected: ONLINE');
        return true;
      }
    } catch (e) {
      this.isBackendOnline = false;
    }
    return false;
  }

  async getVillages() {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/villages`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API error, falling back to mock dataset.');
      }
    }
    return HIMAGUARD_DATA.villages;
  }

  async getVillageById(id) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/villages/${id}`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return HIMAGUARD_DATA.villages.find(v => v.id === id) || HIMAGUARD_DATA.villages[0];
  }

  async getSensors() {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/sensors`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return HIMAGUARD_DATA.sensors;
  }

  async getAlerts() {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/alerts`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return HIMAGUARD_DATA.alerts;
  }

  async createAlert(payload) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/alerts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    // Mock local creation
    const newAlert = {
      id: `ALT-2026-${Math.floor(200 + Math.random() * 800)}`,
      severity: payload.severity || 'Critical',
      badgeClass: `badge-${(payload.severity || 'Critical').toLowerCase()}`,
      village: payload.village || 'Bhairavpur',
      villageId: payload.villageId || 'VIL-001',
      title: payload.title || 'EMERGENCY FLOOD ADVISORY',
      probability: payload.probability || 88,
      leadTime: payload.leadTime || '40 min',
      trigger: 'Manual Emergency Command Dispatch',
      time: 'Just now',
      status: 'ACTIVE',
      recommendedAction: payload.recommendedAction || 'Evacuate immediately.',
      zone: payload.zone || 'Primary Inundation Zone'
    };
    HIMAGUARD_DATA.alerts.unshift(newAlert);
    return newAlert;
  }

  async acknowledgeAlert(alertId) {
    if (this.isBackendOnline) {
      try {
        await fetch(`${this.baseUrl}/alerts/${alertId}/acknowledge`, { method: 'PUT' });
      } catch (e) {}
    }
    const a = HIMAGUARD_DATA.alerts.find(x => x.id === alertId);
    if (a) a.status = 'ACKNOWLEDGED';
    return true;
  }

  async getHistoricalEvents() {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${this.baseUrl}/events`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    return HIMAGUARD_DATA.historicalEvents;
  }
}

window.himaGuardAPI = new HimaGuardAPI();
