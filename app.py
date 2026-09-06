from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS so your frontend HTML file can communicate with this backend locally

@app.route('/api/assess-hazard', methods=['GET'])
def assess_hazard():
    # Retrieve latitude and longitude from query parameters (defaults to Joshimath center)
    lat = float(request.args.get('lat', 30.5520))
    lon = float(request.args.get('lon', 79.5630))
    
    # Dynamic calculation based on location coordinates for realistic evaluation 
    lat_diff = abs(lat - 30.5520)
    lon_diff = abs(lon - 79.5630)
    distance_factor = (lat_diff + lon_diff) * 1000
    
    risk_percent = round(min(max(12.5, 78.5 - distance_factor * 4), 96.4), 2)
    
    # Determine risk status categories
    status = "SAFE"
    time_text = "Low Risk - Normal conditions observed"
    if risk_percent > 50:
        status = "HIGH"
        time_text = "Critical Risk escalation around T+6 Hours"
    elif risk_percent > 30:
        status = "MODERATE"
        time_text = "Moderate Risk escalation around T+24 Hours"

    return jsonify({
        "status": status,
        "risk_percent": risk_percent,
        "time_to_flood_text": time_text,
        "elevation_m": round(1650 + (lat * 8), 1),
        "slope_deg": round(22.5 + (lat_diff * 120), 1),
        "rainfall_mm": round(14.2 + (risk_percent / 3.5), 1),
        "normal_rainfall_mm": 15,
        "flood_depth_cm": round(2.1 + (risk_percent / 4.8), 1),
        "normal_depth_cm": 2
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)