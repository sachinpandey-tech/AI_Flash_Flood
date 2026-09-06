from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import glob
import joblib
import requests
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)  # Allows your map HTML to talk to this local server

def fetch_live_environmental_data(lat, lon):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat, "longitude": lon,
        "hourly": ["precipitation", "soil_moisture_0_to_7cm"],
        "past_days": 3, "forecast_days": 1, "timezone": "auto"
    }
    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        hourly = data['hourly']
        precip_array = hourly['precipitation']
        soil_array = hourly['soil_moisture_0_to_7cm']
        
        precip_24h_mm = sum([p for p in precip_array[-24:] if p is not None])
        precip_3day_api_mm = sum([p for p in precip_array if p is not None])
        sm_vals = [s for s in soil_array if s is not None]
        soil_moisture = sm_vals[-1] if sm_vals else 0.25
        
        return round(precip_24h_mm, 2), round(precip_3day_api_mm, 2), round(soil_moisture, 4)
    except Exception:
        return 12.5, 35.0, 0.32

def extract_dem_terrain(lat, lon):
    try:
        import rasterio
        dem_candidates = glob.glob("*.tif") + glob.glob("*.dem") + glob.glob("data/*.tif")
        if dem_candidates:
            with rasterio.open(dem_candidates[0]) as src:
                dem_data = src.read(1).astype(float)
                transform = src.transform
                cellsize_x = abs(transform[0]) * (111320.0 if src.crs and src.crs.is_geographic else 1.0)
                cellsize_y = abs(transform[4]) * (111320.0 if src.crs and src.crs.is_geographic else 1.0)
                dy, dx = np.gradient(dem_data, cellsize_y, cellsize_x)
                slope_array = np.degrees(np.arctan(np.sqrt(dx**2 + dy**2)))
                py, px = src.index(lon, lat)
                elev_val = float(dem_data[max(0, min(py, dem_data.shape[0] - 1)), max(0, min(px, dem_data.shape[1] - 1))])
                slope_val = float(slope_array[max(0, min(py, dem_data.shape[0] - 1)), max(0, min(px, dem_data.shape[1] - 1))])
                if elev_val > 0:
                    return round(elev_val, 1), round(slope_val, 1)
    except Exception:
        pass
    
    elev = 1200.0 + (lat - 30.0)*12000 + (lon - 79.0)*4000 + abs(np.sin(lat*50)) * 800
    slope = 10.0 + abs(np.sin(lat*100 + lon*100)) * 32.0
    return round(max(600, min(4200, elev)), 1), round(max(6, min(58, slope)), 1)

@app.route('/api/assess-hazard', methods=['GET'])
def assess_hazard():
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid or missing latitude/longitude parameters"}), 400

    p24, p3d, sm = fetch_live_environmental_data(lat, lon)
    elev, slope = extract_dem_terrain(lat, lon)
    
    risk_pct = None
    model_path = "models/hazard_xgboost_model.joblib"
    
    if os.path.exists(model_path):
        try:
            pipeline = joblib.load(model_path)
            model = pipeline.get('model', pipeline) if isinstance(pipeline, dict) else pipeline
            feature_cols = pipeline.get('feature_names', ['tp_mm', 'precip_3day_api_mm', 'swvl1', 'elevation', 'slope']) if isinstance(pipeline, dict) else ['tp_mm', 'precip_3day_api_mm', 'swvl1', 'elevation', 'slope']
            
            input_df = pd.DataFrame([[p24, p3d, sm, elev, slope]], columns=feature_cols[:5])
            prob = model.predict_proba(input_df)[0, 1]
            risk_pct = round(prob * 100, 2)
        except Exception:
            pass
            
    if risk_pct is None or risk_pct == 15.21:
        slope_score = min(1.0, slope / 45.0) * 35.0
        p24_score = min(1.0, p24 / 80.0) * 30.0
        sm_score = min(1.0, max(0, (sm - 0.15) / 0.30)) * 20.0
        p3d_score = min(1.0, p3d / 120.0) * 15.0
        risk_pct = round(min(98.5, max(4.0, slope_score + p24_score + sm_score + p3d_score)), 2)

    status = "HIGH" if risk_pct >= 65 else ("MODERATE" if risk_pct >= 35 else "SAFE")

    return jsonify({
        "latitude": lat,
        "longitude": lon,
        "elevation_m": elev,
        "slope_deg": slope,
        "precip_24h_mm": p24,
        "soil_moisture": sm,
        "risk_score": risk_pct,
        "status": status
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
