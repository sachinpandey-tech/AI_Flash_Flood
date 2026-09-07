// HimaGuard API Client Abstraction Layer
// In Phase 1, this service manages mock data and simulated real-time state.
// All endpoints are prepared for seamless swap to Phase 2 Spring Boot & ML backend.

import {
  MOCK_ROLES,
  INITIAL_VILLAGES,
  INITIAL_SENSORS,
  INITIAL_ALERTS,
  EVACUATION_SHELTERS,
  RIVERS_DATA,
  HISTORICAL_EVENTS,
  MODEL_ANALYTICS
} from './mockData';

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// --- AUTH SERVICES ---

// TODO: replace with real API call to POST /api/v1/auth/login
export async function authLogin(email, password, roleId) {
  await delay(150);
  const role = MOCK_ROLES.find(r => r.id === roleId) || MOCK_ROLES[0];
  const user = {
    id: 'usr-' + role.id,
    email: email || role.defaultEmail,
    role: role.id,
    roleName: role.name,
    badge: role.badge,
    token: 'mock-jwt-token-sih26192-' + Date.now()
  };
  localStorage.setItem('himaguard_user', JSON.stringify(user));
  return { success: true, user };
}

// TODO: replace with real API call to POST /api/v1/auth/logout
export async function authLogout() {
  await delay(50);
  localStorage.removeItem('himaguard_user');
  return { success: true };
}

// --- VILLAGES & HYDROLOGY ---

// TODO: replace with real API call to GET /api/v1/villages
export async function getVillages() {
  await delay();
  return [...INITIAL_VILLAGES];
}

// TODO: replace with real API call to GET /api/v1/villages/{id}
export async function getVillageById(id) {
  await delay();
  const v = INITIAL_VILLAGES.find(item => item.id === id);
  if (!v) throw new Error('Village not found: ' + id);
  return { ...v };
}

// --- SENSORS & TELEMETRY ---

// TODO: replace with real API call to GET /api/v1/sensors
export async function getSensors() {
  await delay();
  return [...INITIAL_SENSORS];
}

// TODO: replace with real API call to GET /api/v1/sensors/{id}
export async function getSensorById(id) {
  await delay();
  const s = INITIAL_SENSORS.find(item => item.id === id);
  if (!s) throw new Error('Sensor not found: ' + id);
  return { ...s };
}

// TODO: replace with real API call to GET /api/v1/sensors/{id}/readings?hours=24
export async function getSensorReadings(sensorId, hours = 24) {
  await delay();
  const sensor = INITIAL_SENSORS.find(s => s.id === sensorId);
  const baseVal = sensor ? sensor.value : 25;
  const history = [];
  const now = Date.now();
  
  for (let i = hours; i >= 0; i--) {
    const t = new Date(now - i * 3600 * 1000);
    const hourLabel = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const variance = (Math.sin(i * 0.4) * 0.15 + (Math.random() - 0.5) * 0.1) * baseVal;
    const reading = Math.max(0, +(baseVal + variance).toFixed(2));
    history.push({
      time: hourLabel,
      timestamp: t.toISOString(),
      value: reading,
      unit: sensor?.unit || ''
    });
  }
  return history;
}

// --- PREDICTIONS & ML FORECASTING ---

// TODO: replace with real API call to GET /api/v1/predictions/latest?villageId={id}
// Phase 2: Will query FastAPI ML service (XGBoost + Physics-Informed LSTM)
export async function getPredictions(villageId = 'v-dharali') {
  await delay(120);
  const village = INITIAL_VILLAGES.find(v => v.id === villageId) || INITIAL_VILLAGES[0];
  
  const timeSeries = [
    { time: '-5h', rain: 12, soil: 51, water: 1.10, prob: 10, predWater: 1.12, observedWater: 1.10 },
    { time: '-4h', rain: 15, soil: 53, water: 1.15, prob: 12, predWater: 1.16, observedWater: 1.15 },
    { time: '-3h', rain: 22, soil: 55, water: 1.20, prob: 15, predWater: 1.22, observedWater: 1.20 },
    { time: '-2h', rain: +(village.rainfall1h * 0.7).toFixed(1), soil: +(village.soilMoisture * 0.9).toFixed(1), water: +(village.waterLevel * 0.85).toFixed(2), prob: Math.round(village.floodProbability * 0.6), predWater: +(village.waterLevel * 0.86).toFixed(2), observedWater: +(village.waterLevel * 0.85).toFixed(2) },
    { time: '-1h', rain: +(village.rainfall1h * 0.9).toFixed(1), soil: +(village.soilMoisture * 0.96).toFixed(1), water: +(village.waterLevel * 0.94).toFixed(2), prob: Math.round(village.floodProbability * 0.85), predWater: +(village.waterLevel * 0.95).toFixed(2), observedWater: +(village.waterLevel * 0.94).toFixed(2) },
    { time: 'Now', rain: village.rainfall1h, soil: village.soilMoisture, water: village.waterLevel, prob: village.floodProbability, predWater: village.waterLevel, observedWater: village.waterLevel },
    { time: '+1h', rain: +(village.rainfall1h * 1.15).toFixed(1), soil: Math.min(99, +(village.soilMoisture * 1.05).toFixed(1)), water: +(village.waterLevel * 1.12).toFixed(2), prob: Math.min(99, Math.round(village.floodProbability * 1.12)), predWater: +(village.waterLevel * 1.14).toFixed(2), observedWater: null },
    { time: '+2h', rain: +(village.rainfall1h * 1.08).toFixed(1), soil: Math.min(99, +(village.soilMoisture * 1.08).toFixed(1)), water: +(village.waterLevel * 1.20).toFixed(2), prob: Math.min(99, Math.round(village.floodProbability * 1.18)), predWater: +(village.waterLevel * 1.22).toFixed(2), observedWater: null },
    { time: '+3h', rain: +(village.rainfall1h * 0.85).toFixed(1), soil: Math.min(99, +(village.soilMoisture * 1.06).toFixed(1)), water: +(village.waterLevel * 1.15).toFixed(2), prob: Math.min(99, Math.round(village.floodProbability * 1.05)), predWater: +(village.waterLevel * 1.17).toFixed(2), observedWater: null }
  ];

  return {
    villageId: village.id,
    villageName: village.name,
    floodProbability: village.floodProbability,
    leadTime: village.leadTime,
    riskLevel: village.riskLevel,
    confidenceScore: 89.4,
    timeSeries
  };
}

// --- ALERTS ---

// TODO: replace with real API call to GET /api/v1/alerts
export async function getAlerts() {
  await delay();
  return [...INITIAL_ALERTS];
}

// TODO: replace with real API call to POST /api/v1/alerts
export async function createAlert(alertPayload) {
  await delay(150);
  const newAlert = {
    id: 'ALT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
    timestamp: 'Just now',
    status: 'active',
    ...alertPayload
  };
  return newAlert;
}

// TODO: replace with real API call to PUT /api/v1/alerts/{id}/acknowledge
export async function acknowledgeAlert(alertId) {
  await delay(80);
  return { id: alertId, status: 'acknowledged', acknowledgedAt: new Date().toISOString() };
}

// --- HISTORICAL & ANALYTICS ---

// TODO: replace with real API call to GET /api/v1/historical-events
export async function getHistoricalEvents() {
  await delay();
  return [...HISTORICAL_EVENTS];
}

// TODO: replace with real API call to GET /api/v1/shelters
export async function getShelters() {
  await delay();
  return [...EVACUATION_SHELTERS];
}

// TODO: replace with real API call to GET /api/v1/rivers
export async function getRivers() {
  await delay();
  return [...RIVERS_DATA];
}

// TODO: replace with real API call to GET /api/v1/analytics/model-metrics
export async function getModelAnalytics() {
  await delay();
  return { ...MODEL_ANALYTICS };
}
