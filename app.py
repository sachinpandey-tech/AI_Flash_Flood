from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/api/assess-hazard', methods=['GET'])
def assess_hazard():
    lat = float(request.args.get('lat', 30.5))
    lon = float(request.args.get('lon', 79.5))
    
    elevation_m = round(random.uniform(1200, 3500), 2)
    slope_deg = round(random.uniform(5.0, 45.0), 2)
    rainfall_mm = round(random.uniform(10.0, 150.0), 2)
    flood_depth_cm = round(random.uniform(2.0, 50.0), 2)
    
    risk_percent = round((rainfall_mm * 0.4) + (slope_deg * 0.3) - (elevation_m / 500 * 0.3), 2)
    risk_percent = max(0, min(100, risk_percent))
    
    if risk_percent > 40:
        status = "HIGH"
        time_to_flood_text = "Critical impact expected within 45 minutes."
    elif risk_percent > 20:
        status = "MODERATE"
        time_to_flood_text = "Elevated water levels expected within 2 hours."
    else:
        status = "SAFE"
        time_to_flood_text = "No immediate flood threat detected."
        
    return jsonify({
        "status": status,
        "risk_percent": risk_percent,
        "time_to_flood_text": time_to_flood_text,
        "elevation_m": elevation_m,
        "slope_deg": slope_deg,
        "rainfall_mm": rainfall_mm,
        "normal_rainfall_mm": 15,
        "flood_depth_cm": flood_depth_cm,
        "normal_depth_cm": 2
    })

@app.route('/')
def home():
    return "FloodSafe Flask API is running successfully!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)