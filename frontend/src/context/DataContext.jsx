import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_VILLAGES, INITIAL_SENSORS, INITIAL_ALERTS } from '../services/mockData';

const DataContext = createContext(null);

export const SIMULATION_STAGES = [
  {
    stageIndex: 0,
    name: 'Normal Baseline (Low)',
    rainfall: 20,
    soilMoisture: 55,
    waterLevel: 1.2,
    riskLevel: 'low',
    probability: 14,
    leadTime: '> 6 hours',
    statusText: 'Catchment normal. Soil receptive to infiltration.'
  },
  {
    stageIndex: 1,
    name: 'Heavy Pre-monsoon Rain (Moderate)',
    rainfall: 45,
    soilMoisture: 68,
    waterLevel: 1.6,
    riskLevel: 'moderate',
    probability: 38,
    leadTime: '4.5 hours',
    statusText: 'Rainfall increasing. Subsoil infiltration slowing down.'
  },
  {
    stageIndex: 2,
    name: 'Torrential Downpour (High)',
    rainfall: 72,
    soilMoisture: 82,
    waterLevel: 2.4,
    riskLevel: 'high',
    probability: 67,
    leadTime: '2.5 hours',
    statusText: 'Severe storm cell. River rising fast (+0.8m in 30 mins).'
  },
  {
    stageIndex: 3,
    name: 'Cloudburst Inundation (Very High)',
    rainfall: 105,
    soilMoisture: 91,
    waterLevel: 2.9,
    riskLevel: 'high',
    probability: 84,
    leadTime: '75 mins',
    statusText: 'Cloudburst confirmed. Soil saturated. Surface runoff cascading into valley.'
  },
  {
    stageIndex: 4,
    name: 'Peak Flash Flood Surge (Critical)',
    rainfall: 120,
    soilMoisture: 95,
    waterLevel: 3.4,
    riskLevel: 'critical',
    probability: 96,
    leadTime: '25 mins',
    statusText: 'CRITICAL DISASTER: River overflow at 3.4m (+2.2m). Siren broadcast required!'
  }
];

export const DataProvider = ({ children }) => {
  const [villages, setVillages] = useState(INITIAL_VILLAGES);
  const [sensors, setSensors] = useState(INITIAL_SENSORS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Simulation Engine State
  const [simulation, setSimulation] = useState({
    isActive: false,
    targetVillageId: 'v-dharali',
    currentStage: 0,
    elapsedSeconds: 0,
    isPaused: false,
    alertGenerated: false
  });

  const simIntervalRef = useRef(null);

  const toggleDemoMode = () => {
    setIsDemoMode(prev => {
      const next = !prev;
      if (!next && simulation.isActive) {
        stopSimulation();
      }
      return next;
    });
  };

  const stopSimulation = () => {
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    simIntervalRef.current = null;
    setSimulation({
      isActive: false,
      targetVillageId: 'v-dharali',
      currentStage: 0,
      elapsedSeconds: 0,
      isPaused: false,
      alertGenerated: false
    });
    setVillages(INITIAL_VILLAGES);
    setSensors(INITIAL_SENSORS);
  };

  const applyStage = (stageIdx, villageId = 'v-dharali') => {
    const stage = SIMULATION_STAGES[stageIdx] || SIMULATION_STAGES[0];
    
    setVillages(prev => prev.map(v => {
      if (v.id === villageId) {
        return {
          ...v,
          riskLevel: stage.riskLevel,
          floodProbability: stage.probability,
          leadTime: stage.leadTime,
          rainfall1h: stage.rainfall,
          soilMoisture: stage.soilMoisture,
          waterLevel: stage.waterLevel,
          waterLevelTrend: stageIdx === 0 ? 'stable' : 'rising',
          whyFactors: [
            {
              factor: '1h Precipitation Rate',
              status: stage.rainfall > 70 ? 'hazard' : stage.rainfall > 40 ? 'warning' : 'normal',
              detail: `${stage.rainfall} mm/h rainfall (FFG threshold: 45 mm/h)`
            },
            {
              factor: 'Topsoil Saturation (TDR)',
              status: stage.soilMoisture > 85 ? 'hazard' : stage.soilMoisture > 65 ? 'warning' : 'normal',
              detail: `${stage.soilMoisture}% saturation measured across hillslope`
            },
            {
              factor: 'River Channel Level',
              status: stage.waterLevel >= 3.0 ? 'hazard' : stage.waterLevel >= 2.0 ? 'warning' : 'normal',
              detail: `${stage.waterLevel} m (Danger level: 2.80 m)`
            },
            {
              factor: 'Catchment Slope Acceleration',
              status: 'warning',
              detail: 'Steep incline (34?) funneling surface water to main channel'
            },
            {
              factor: 'Model Diagnostic Summary',
              status: stage.riskLevel === 'critical' ? 'hazard' : stage.riskLevel === 'high' ? 'warning' : 'normal',
              detail: stage.statusText
            }
          ]
        };
      }
      return v;
    }));

    setSensors(prev => prev.map(s => {
      if (s.villageId === villageId) {
        if (s.type === 'Automated Rain Gauge') return { ...s, value: stage.rainfall, lastUpdated: 'Just now' };
        if (s.type === 'Soil Moisture TDR') return { ...s, value: stage.soilMoisture, lastUpdated: 'Just now' };
        if (s.type === 'Ultrasonic Water Radar') return { ...s, value: stage.waterLevel, lastUpdated: 'Just now' };
      }
      return s;
    }));

    if (stageIdx === 4) {
      setAlerts(prev => {
        const alreadyExists = prev.some(a => a.id.startsWith('ALT-SIM-'));
        if (alreadyExists) return prev;
        const targetV = INITIAL_VILLAGES.find(x => x.id === villageId) || INITIAL_VILLAGES[0];
        const newCritAlert = {
          id: 'ALT-SIM-' + Date.now(),
          villageId: targetV.id,
          villageName: targetV.name,
          severity: 'critical',
          title: `EMERGENCY: FLASH FLOOD SURGE IN ${targetV.name.toUpperCase()}`,
          probability: 96,
          leadTime: '25 mins',
          timestamp: 'Just now',
          status: 'active',
          recommendedAction: `CRITICAL ACTION MANDATORY: Cloudburst triggered 120 mm/hr rainfall. River gauge at 3.4m (+2.2m surge). Evacuate all Riverside Bazaar residents to GMVN Tourist Rest House & Inter College immediately. Sound civil defence sirens.`,
          channels: ['Automated Village Siren', 'Disaster SMS Broadcast', 'DEOC Hotline', 'Police Wireless']
        };
        return [newCritAlert, ...prev];
      });
    }
  };

  const startFlashFloodSimulation = (villageId = 'v-dharali') => {
    if (!isDemoMode) setIsDemoMode(true);
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);

    setSimulation({
      isActive: true,
      targetVillageId: villageId,
      currentStage: 0,
      elapsedSeconds: 0,
      isPaused: false,
      alertGenerated: false
    });

    applyStage(0, villageId);

    const STAGE_DURATION_SEC = 15;
    let currentSec = 0;

    simIntervalRef.current = setInterval(() => {
      currentSec += 1;
      const nextStage = Math.min(4, Math.floor(currentSec / STAGE_DURATION_SEC));

      setSimulation(prev => {
        if (!prev.isActive || prev.isPaused) return prev;
        return {
          ...prev,
          elapsedSeconds: currentSec,
          currentStage: nextStage
        };
      });

      applyStage(nextStage, villageId);

      if (nextStage >= 4 && currentSec >= STAGE_DURATION_SEC * 4 + 5) {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
      }
    }, 1000);
  };

  const jumpToStage = (stageIdx, villageId = 'v-dharali') => {
    if (!simulation.isActive) {
      setSimulation({
        isActive: true,
        targetVillageId: villageId,
        currentStage: stageIdx,
        elapsedSeconds: stageIdx * 15,
        isPaused: true,
        alertGenerated: stageIdx === 4
      });
    } else {
      setSimulation(prev => ({
        ...prev,
        currentStage: stageIdx,
        elapsedSeconds: stageIdx * 15
      }));
    }
    applyStage(stageIdx, villageId);
  };

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'acknowledged', acknowledgedAt: new Date().toLocaleTimeString() } : a));
  };

  const addNewAlert = (alertData) => {
    const newAlert = {
      id: 'ALT-OP-' + Date.now(),
      timestamp: 'Just now',
      status: 'active',
      ...alertData
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  return (
    <DataContext.Provider value={{
      villages,
      sensors,
      alerts,
      isDemoMode,
      toggleDemoMode,
      simulation,
      startFlashFloodSimulation,
      stopSimulation,
      jumpToStage,
      acknowledgeAlert,
      addNewAlert
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
};
