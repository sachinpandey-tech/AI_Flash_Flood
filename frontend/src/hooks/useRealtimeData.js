import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

export function useRealtimeData() {
  const { villages, sensors, alerts, isDemoMode, simulation } = useData();
  const [pulseTick, setPulseTick] = useState(0);

  useEffect(() => {
    // Gentle telemetry heartbeat pulse every 4 seconds
    const interval = setInterval(() => {
      setPulseTick(t => t + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return {
    villages,
    sensors,
    alerts,
    isDemoMode,
    simulation,
    pulseTick,
    activeAlertsCount: alerts.filter(a => a.status === 'active').length,
    criticalVillagesCount: villages.filter(v => v.riskLevel === 'critical').length,
    highRiskVillagesCount: villages.filter(v => v.riskLevel === 'high').length
  };
}
