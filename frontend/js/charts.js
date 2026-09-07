/**
 * HimaGuard: Interactive Charts & Visual Analytics Engine
 * SIH 2026 Problem Statement SIH26192
 */

class HimaGuardCharts {
  constructor() {
    this.predictionTrendChart = null;
    this.multiParamChart = null;
    this.modelPerfChart = null;
    this.monthlyRainChart = null;
    this.replayChart = null;
    this.currentVillageId = 'VIL-001';
  }

  init() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not yet loaded, retrying in 400ms...');
      setTimeout(() => this.init(), 400);
      return;
    }

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.08)';
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    this.renderMultiParamChart();
    this.renderPredictionTrendChart();
    this.renderAnalyticsCharts();
  }

  renderMultiParamChart() {
    const canvas = document.getElementById('chartMultiParam');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const labels = ['T-5h', 'T-4h', 'T-3h', 'T-2h', 'T-1h', 'Current (T0)'];

    if (this.multiParamChart) this.multiParamChart.destroy();

    this.multiParamChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Rainfall (mm/hr)',
            data: [14.0, 22.5, 38.0, 54.0, 68.0, 74.0],
            backgroundColor: 'rgba(56, 189, 248, 0.65)',
            borderColor: '#38bdf8',
            borderWidth: 1.5,
            yAxisID: 'yRain',
            borderRadius: 4
          },
          {
            type: 'line',
            label: 'Water Level (m)',
            data: [1.30, 1.45, 1.75, 2.10, 2.50, 2.80],
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            yAxisID: 'yWater'
          },
          {
            type: 'line',
            label: 'Danger Crest (3.2m)',
            data: [3.2, 3.2, 3.2, 3.2, 3.2, 3.2],
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [5, 4],
            pointRadius: 0,
            fill: false,
            yAxisID: 'yWater'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, color: '#e2e8f0' } }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.04)' } },
          yRain: {
            type: 'linear',
            position: 'left',
            min: 0,
            max: 100,
            title: { display: true, text: 'Rainfall (mm/hr)', color: '#38bdf8' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          yWater: {
            type: 'linear',
            position: 'right',
            min: 0,
            max: 5.0,
            title: { display: true, text: 'River Water Level (m)', color: '#f43f5e' },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });
  }

  renderPredictionTrendChart() {
    const canvas = document.getElementById('chartPredictionTrend');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const labels = ['-60m', '-45m', '-30m', '-15m', 'Now', '+15m (Pred)', '+30m (Pred)', '+45m (Pred)'];

    if (this.predictionTrendChart) this.predictionTrendChart.destroy();

    this.predictionTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Observed Risk Probability (%)',
            data: [28, 42, 61, 74, 87, null, null, null],
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.2)',
            borderWidth: 3,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: '#f97316',
            fill: true
          },
          {
            label: 'AI Forecasted Probability Curve (%)',
            data: [null, null, null, null, 87, 92, 95, 93],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2.5,
            borderDash: [6, 4],
            pointRadius: 4,
            pointBackgroundColor: '#ef4444',
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, color: '#e2e8f0' } }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            title: { display: true, text: 'Flood Probability (%)', color: '#f97316' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }
          },
          x: { grid: { color: 'rgba(255, 255, 255, 0.04)' } }
        }
      }
    });
  }

  renderAnalyticsCharts() {
    // Model Performance: Predicted vs Actual
    const canvasPerf = document.getElementById('chartModelPerf');
    if (canvasPerf) {
      const ctx = canvasPerf.getContext('2d');
      if (this.modelPerfChart) this.modelPerfChart.destroy();

      this.modelPerfChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Event 1', 'Event 2', 'Event 3', 'Event 4', 'Event 5', 'Event 6', 'Event 7', 'Event 8', 'Event 9', 'Event 10'],
          datasets: [
            {
              label: 'Actual Surge Inundation (m)',
              data: [2.8, 3.4, 1.9, 4.1, 2.5, 3.8, 1.6, 2.9, 3.6, 2.2],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 2,
              tension: 0.2
            },
            {
              label: 'XGBoost Predicted Peak (m)',
              data: [2.9, 3.3, 2.0, 3.9, 2.6, 3.7, 1.7, 3.0, 3.5, 2.1],
              borderColor: '#38bdf8',
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderDash: [5, 4],
              tension: 0.2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top', labels: { boxWidth: 12, color: '#e2e8f0' } } },
          scales: {
            y: { title: { display: true, text: 'Peak Water Height (m)' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
            x: { grid: { color: 'rgba(255, 255, 255, 0.04)' } }
          }
        }
      });
    }

    // Monthly Himalayan Precipitation
    const canvasRain = document.getElementById('chartMonthlyRain');
    if (canvasRain) {
      const ctx = canvasRain.getContext('2d');
      if (this.monthlyRainChart) this.monthlyRainChart.destroy();

      this.monthlyRainChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [
            {
              label: 'Monthly Rainfall (mm)',
              data: [85, 240, 480, 520, 310, 65],
              backgroundColor: 'rgba(14, 165, 233, 0.65)',
              borderColor: '#0ea5e9',
              borderWidth: 1.5,
              borderRadius: 4
            },
            {
              type: 'line',
              label: 'Flash Flood Incidents Recorded',
              data: [0, 2, 7, 9, 3, 0],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              borderWidth: 2.5,
              yAxisID: 'yIncidents',
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top', labels: { boxWidth: 12, color: '#e2e8f0' } } },
          scales: {
            y: { title: { display: true, text: 'Rainfall (mm)' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
            yIncidents: { position: 'right', min: 0, max: 12, title: { display: true, text: 'Flood Events' }, grid: { drawOnChartArea: false } },
            x: { grid: { color: 'rgba(255, 255, 255, 0.04)' } }
          }
        }
      });
    }
  }

  updateVillageCharts(village) {
    if (!this.multiParamChart) return;
    const s = village.sensors;
    const lastIdx = this.multiParamChart.data.datasets[0].data.length - 1;
    this.multiParamChart.data.datasets[0].data[lastIdx] = s.rainGauge;
    this.multiParamChart.data.datasets[1].data[lastIdx] = s.waterLevel;
    this.multiParamChart.update('none');
  }
}

window.himaGuardCharts = new HimaGuardCharts();
