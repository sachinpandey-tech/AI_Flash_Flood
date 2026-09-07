-- =============================================================================
-- HimaGuard: PostgreSQL + PostGIS Relational Database Schema
-- SIH 2026 Problem Statement SIH26192: Flash Flood Prediction for Hilly Regions
-- =============================================================================

-- Enable PostGIS spatial extension if installed
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Table (Role-based access: ADMIN, DISASTER_AUTHORITY, OPERATOR, CITIZEN)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('ADMIN', 'DISASTER_AUTHORITY', 'OPERATOR', 'CITIZEN')),
    phone VARCHAR(20),
    organization VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Villages / Wards Table (Geographical & Hydrological Catchment Entity)
CREATE TABLE IF NOT EXISTS villages (
    id VARCHAR(20) PRIMARY KEY, -- e.g. VIL-001
    name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(50) DEFAULT 'Uttarakhand',
    population INTEGER NOT NULL,
    households INTEGER NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    elevation_meters NUMERIC(6, 1) NOT NULL,
    slope_gradient_deg NUMERIC(4, 1) NOT NULL,
    nearby_river VARCHAR(120) NOT NULL,
    distance_to_river_meters NUMERIC(6, 1),
    landslide_risk_level VARCHAR(20) DEFAULT 'Moderate',
    historical_flood_count INTEGER DEFAULT 0,
    historical_landslide_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. IoT Sensor Devices
CREATE TABLE IF NOT EXISTS sensors (
    id VARCHAR(30) PRIMARY KEY, -- e.g. UTK001
    sensor_type VARCHAR(50) NOT NULL, -- Rain Gauge, Soil Moisture, Water Level Sonar, Temp/Humidity
    village_id VARCHAR(20) REFERENCES villages(id) ON DELETE CASCADE,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    firmware_version VARCHAR(20) DEFAULT 'v2.1-LoRa',
    battery_percentage INTEGER DEFAULT 100,
    signal_strength VARCHAR(20) DEFAULT 'Strong',
    status VARCHAR(20) DEFAULT 'ONLINE' CHECK (status IN ('ONLINE', 'WARNING', 'OFFLINE', 'MAINTENANCE')),
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Real-Time Time-Series Sensor Readings
CREATE TABLE IF NOT EXISTS sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    sensor_id VARCHAR(30) REFERENCES sensors(id) ON DELETE CASCADE,
    reading_value NUMERIC(8, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- mm/hr, %, meters, degC
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_time ON sensor_readings(sensor_id, recorded_at DESC);

-- 5. AI Flash Flood Risk Predictions (Output of ML Model)
CREATE TABLE IF NOT EXISTS predictions (
    id BIGSERIAL PRIMARY KEY,
    village_id VARCHAR(20) REFERENCES villages(id) ON DELETE CASCADE,
    flood_probability NUMERIC(4, 3) NOT NULL, -- 0.000 to 1.000
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('Low', 'Moderate', 'High', 'Critical')),
    estimated_lead_time_mins INTEGER NOT NULL,
    confidence_score NUMERIC(4, 3) NOT NULL,
    rain_1h_input NUMERIC(6, 2),
    soil_moisture_input NUMERIC(5, 2),
    water_level_input NUMERIC(5, 2),
    water_level_change_rate NUMERIC(5, 2),
    rule_override_applied BOOLEAN DEFAULT FALSE,
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Emergency Alerts & Common Alerting Protocol (CAP) Dispatches
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(30) PRIMARY KEY, -- ALT-2026-104
    village_id VARCHAR(20) REFERENCES villages(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Moderate', 'High', 'Critical')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    affected_zone VARCHAR(150),
    probability NUMERIC(5, 2),
    estimated_lead_time VARCHAR(30),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'EXPIRED')),
    dispatched_by INTEGER REFERENCES users(id),
    dispatched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at TIMESTAMP WITH TIME ZONE
);

-- 7. Designated Safe Evacuation Shelters
CREATE TABLE IF NOT EXISTS shelters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    village_id VARCHAR(20) REFERENCES villages(id) ON DELETE CASCADE,
    capacity INTEGER NOT NULL,
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    elevation_gain_meters NUMERIC(5, 1) NOT NULL,
    distance_meters INTEGER NOT NULL,
    has_medical_supplies BOOLEAN DEFAULT TRUE,
    has_emergency_power BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'Ready'
);

-- 8. Evacuation Zones & Hazard Corridors
CREATE TABLE IF NOT EXISTS evacuation_zones (
    id SERIAL PRIMARY KEY,
    village_id VARCHAR(20) REFERENCES villages(id) ON DELETE CASCADE,
    zone_name VARCHAR(100) NOT NULL,
    inundation_risk_tier VARCHAR(30) NOT NULL,
    population_affected INTEGER NOT NULL,
    evacuation_direction VARCHAR(200) NOT NULL
);

-- 9. Historical Disaster Events Catalog
CREATE TABLE IF NOT EXISTS historical_events (
    id VARCHAR(30) PRIMARY KEY, -- EVT-2023-04
    village_id VARCHAR(20) REFERENCES villages(id),
    event_date DATE NOT NULL,
    location_name VARCHAR(150) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    peak_rainfall_mm NUMERIC(6, 2),
    peak_water_level_meters NUMERIC(5, 2),
    severity VARCHAR(20) NOT NULL,
    impact_description TEXT,
    observed_lead_time_mins INTEGER
);

-- 10. External Weather Forecast & Satellite Data Cache
CREATE TABLE IF NOT EXISTS weather_data (
    id BIGSERIAL PRIMARY KEY,
    basin_name VARCHAR(100) NOT NULL,
    precipitation_forecast_3h NUMERIC(6, 2),
    precipitation_forecast_6h NUMERIC(6, 2),
    cloud_convective_index NUMERIC(5, 2),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
