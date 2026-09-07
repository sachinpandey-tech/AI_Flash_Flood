# HimaGuard: Hyperlocal Flash Flood Early Warning & Disaster Response System

**Smart India Hackathon 2026 — Problem Statement SIH26192**  
*“Flash Flood Prediction System for Hilly Regions using Multi-Source Data”*

---

## 🏔️ System Overview

**HimaGuard** is a Disaster Operations Command Center and Hyperlocal Early Warning System engineered specifically for the steep, vulnerable river basins of the Himalayas (such as the Mandakini and Alaknanda valleys in Uttarakhand).

The system integrates:
1. **Real-time IoT Telemetry** (Automatic Rain Gauges, Soil Moisture Probes, Ultrasonic River Sonar)
2. **Topographical GIS Contours** (Catchment Slope Gradient, Elevation, Gorge Bottlenecks)
3. **Machine Learning Predictive Analytics** (XGBoost / Random Forest 11-feature ensemble)
4. **Rule-Based Safety Decision Layer** (Immediate Critical Overrides on hazardous multi-parameter convergence)
5. **Civil Defense & Public Warning System** (Automated CAP SMS alerts, lead-time countdowns, safe shelter routing)

> [!NOTE]  
> **Scientific Positioning:** HimaGuard is designed as a *Prototype Decision Support & Early Warning System* built to empower disaster management authorities (NDMA, SDMA, District Emergency Operations Centers) with actionable lead-time intelligence.

---

## 🚀 Quick Launch Guide

### Method 1: Launch Directly in Web Browser (Instant)
Simply double-click or open `index.html` in Microsoft Edge, Google Chrome, Firefox, or Safari:
```powershell
Start-Process "C:\Users\techw\.gemini\antigravity\scratch\himaguard\index.html"
```
Or open the Citizen Emergency view:
```powershell
Start-Process "C:\Users\techw\.gemini\antigravity\scratch\himaguard\citizen.html"
```

### Method 2: Launch Full Python REST & ML Server
Run the built-in Python backend server:
```powershell
cd C:\Users\techw\.gemini\antigravity\scratch\himaguard
python backend\server.py 8000
```
Then visit:
- **Command Center Dashboard:** [http://localhost:8000/index.html](http://localhost:8000/index.html)
- **Citizen Emergency Portal:** [http://localhost:8000/citizen.html](http://localhost:8000/citizen.html)
- **ML Scoring Microservice:** [http://localhost:8000/api/predict](http://localhost:8000/api/predict)

---

## 🏆 SIH 2026 2–3 Minute Presentation Script (Judge-Ready)

1. **Login & Role Selection (0:00 - 0:20)**:
   - Open `index.html`. Explain the 4 demo roles (*Disaster Authority, Emergency Operator, Administrator, Citizen*).
   - Click **"Disaster Authority"** to enter the Command Center.

2. **Situation Awareness Dashboard (0:20 - 0:45)**:
   - Highlight the 6 primary statistics cards: **12 Monitored Villages, 3 Critical, 5 High Risk, 18/20 Sensors Online, 4 Active Alerts, 8,450 Affected Population**.
   - Show the Mandakini–Alaknanda Basin overview matrix.

3. **Live Risk Map Inspection (0:45 - 1:15)**:
   - Navigate to **Live Risk Map**. Toggle layers (*Rivers, Risk Zones, IoT Sensors, Safe Shelters*).
   - Click on the village marker for **Bhairavpur**.
   - Point out the real-time telemetry: **Rainfall 74 mm/h, River Level 2.8m, Surge Rate +18 cm/10min, Estimated Lead Time 42 minutes**.
   - Click **"View Detailed Analysis"** to transition to the Village Disaster Dossier.

4. **Village Risk Decomposition & AI Rationale (1:15 - 1:45)**:
   - Review the 5 multi-source factor bars: *Rainfall Risk (92%), Soil Saturation (86%), Water Level (79%), Slope (71%), Historical (64%)*.
   - Point out the **AI Decision Rationale ("WHY IS THE RISK HIGH?")** with clear explainable checkmarks.
   - Show the evacuation section with designated high-ground shelters (*Govt Inter College Elevated Campus, +35m elevation*).

5. **SIH Flash Flood Simulation Trigger (1:45 - 2:15)**:
   - Click the glowing red button in the top bar: **"⚡ SIMULATE FLASH FLOOD (Bhairavpur)"**.
   - Watch the 5-stage cloudburst sequence animate:
     $$\text{Rain: } 20 \rightarrow 45 \rightarrow 72 \rightarrow 105 \rightarrow 120\text{ mm/hr}$$
     $$\text{Soil: } 55 \rightarrow 68 \rightarrow 82 \rightarrow 91 \rightarrow 95\%$$
     $$\text{River: } 1.2 \rightarrow 1.6 \rightarrow 2.4 \rightarrow 2.9 \rightarrow 3.4\text{ m}$$
     $$\text{Risk: LOW (Green)} \rightarrow \text{MODERATE (Yellow)} \rightarrow \text{HIGH (Orange)} \rightarrow \text{CRITICAL (Red)}$$
   - Critical chime sounds and the **Emergency Broadcast Modal** pops up with delivery to **1,840 residents** and a **38-minute actionable lead time**.

6. **Historical Event Replay & Citizen View (2:15 - 2:45)**:
   - Navigate to **Historical Events** and click **"▶️ Replay 2023 Mandakini Surge"** to show past event reconstruction.
   - Open **Citizen View** (`citizen.html`) to demonstrate how a resident receives the high-contrast emergency warning (*"MOVE TO HIGHER GROUND"* and walking route to shelter).

---

## 🏛️ Application Architecture & Project Structure

```
himaguard/
├── index.html                   # Master Command Center Single-Page App (10 views)
├── citizen.html                 # Mobile-first Public Citizen Emergency View
├── css/
│   └── command-center.css       # Enterprise Disaster Command Center Theme
├── js/
│   ├── data.js                  # 12 Himalayan villages, 20 IoT sensors, shelters, events
│   ├── predictionEngine.js      # Hybrid Risk Engine (ML + rule safety layers)
│   ├── charts.js                # Chart.js time-series & analytics visualizer
│   ├── map.js                   # Leaflet GIS engine with river & risk layers
│   ├── simulation.js            # SIH Flash Flood live runner & event replay
│   ├── api.js                   # API service abstraction (REST <-> mock fallback)
│   └── app.js                   # Navigation router, auth & view coordinator
├── backend/
│   ├── server.py                # Python REST & Static Web Server
│   ├── schema.sql               # PostgreSQL / PostGIS Relational Database Schema
│   └── ml_service/
│       └── model.py             # 11-feature Machine Learning predictive model
└── README.md                    # Project documentation & presentation guide
```

---

## 📡 REST API Specifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/villages` | Returns all 12 monitored village risk dossiers |
| `GET` | `/api/villages/{id}` | Returns single village physical & sensor profile |
| `GET` | `/api/sensors` | Returns telemetry readings from all 20 IoT sensors |
| `GET` | `/api/alerts` | Returns active and resolved disaster alerts |
| `POST` | `/api/alerts` | Dispatches new emergency alert via CAP protocol |
| `PUT` | `/api/alerts/{id}/acknowledge` | Acknowledges alert by emergency operator |
| `POST` | `/api/predict` | Executes 11-parameter ML prediction model |
| `GET` | `/api/events` | Returns historical flood and landslide records |
