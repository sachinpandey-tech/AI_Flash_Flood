"""
HimaGuard: Python Backend REST API & Static Server
SIH 2026 Problem Statement SIH26192: Flash Flood Prediction for Hilly Regions

Provides unified REST APIs:
- GET /api/villages
- GET /api/villages/<id>
- GET /api/sensors
- GET /api/alerts
- POST /api/alerts
- PUT /api/alerts/<id>/acknowledge
- POST /api/predict (Invokes FlashFloodPredictor with 11 features)
- GET /api/events
- Static web hosting for HimaGuard Command Center & Citizen Portal
"""

import http.server
import socketserver
import json
import os
import sys
from urllib.parse import urlparse, parse_qs

# Add ml_service to path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, 'ml_service'))
from model import FlashFloodPredictor

# Root project directory
PROJECT_ROOT = os.path.dirname(current_dir)

predictor = FlashFloodPredictor()

# Load mock dataset for fallback persistence
DATA_FILE = os.path.join(PROJECT_ROOT, 'js', 'data.js')

class HimaGuardHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PROJECT_ROOT, **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == '/api/health':
            self.send_json({'status': 'ONLINE', 'service': 'HimaGuard REST Core', 'sih_code': 'SIH26192'})
        elif path == '/api/villages':
            self.serve_villages()
        elif path.startswith('/api/villages/'):
            village_id = path.split('/')[-1]
            self.serve_village_detail(village_id)
        elif path == '/api/sensors':
            self.serve_sensors()
        elif path == '/api/alerts':
            self.serve_alerts()
        elif path == '/api/events':
            self.serve_events()
        else:
            # Default static file handler
            super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(length) if length > 0 else b'{}'
        try:
            body = json.loads(post_data.decode('utf-8'))
        except Exception:
            body = {}

        if path == '/api/predict':
            # Execute 11-feature ML prediction
            result = predictor.predict(body)
            self.send_json(result)
        elif path == '/api/alerts':
            # Mock alert registration
            new_alert = {
                'id': f"ALT-2026-{body.get('village', 'VIL')[:3].upper()}",
                'severity': body.get('severity', 'Critical'),
                'title': body.get('title', 'EMERGENCY FLOOD WARNING'),
                'village': body.get('village', 'Bhairavpur'),
                'status': 'ACTIVE',
                'leadTime': body.get('leadTime', '40 min'),
                'probability': body.get('probability', 88)
            }
            self.send_json(new_alert, status=201)
        else:
            self.send_json({'error': 'Endpoint not found'}, status=404)

    def do_PUT(self):
        parsed = urlparse(self.path)
        if '/api/alerts/' in parsed.path and parsed.path.endswith('/acknowledge'):
            self.send_json({'status': 'ACKNOWLEDGED', 'message': 'Alert acknowledged by EOC'})
        else:
            self.send_json({'error': 'Invalid PUT target'}, status=400)

    def send_json(self, data, status=200):
        content = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Length', str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def serve_villages(self):
        villages = [
            {"id": "VIL-001", "name": "Bhairavpur", "district": "Rudraprayag", "status": "Critical", "floodProbability": 87, "estimatedLeadTime": 42},
            {"id": "VIL-002", "name": "Joshimath Valley", "district": "Chamoli", "status": "High", "floodProbability": 72, "estimatedLeadTime": 58},
            {"id": "VIL-003", "name": "Karnaprayag Reach", "district": "Chamoli", "status": "Critical", "floodProbability": 84, "estimatedLeadTime": 48},
            {"id": "VIL-004", "name": "Rudraprayag Confluence", "district": "Rudraprayag", "status": "High", "floodProbability": 76, "estimatedLeadTime": 55},
            {"id": "VIL-005", "name": "Devprayag Sangam", "district": "Tehri Garhwal", "status": "Moderate", "floodProbability": 58, "estimatedLeadTime": 85},
            {"id": "VIL-006", "name": "Guptkashi Slope", "district": "Rudraprayag", "status": "High", "floodProbability": 71, "estimatedLeadTime": 62},
            {"id": "VIL-007", "name": "Tilwara Basin", "district": "Rudraprayag", "status": "Critical", "floodProbability": 86, "estimatedLeadTime": 36},
            {"id": "VIL-008", "name": "Nandaprayag Ghat", "district": "Chamoli", "status": "Moderate", "floodProbability": 54, "estimatedLeadTime": 95},
            {"id": "VIL-009", "name": "Ukhimath Hillside", "district": "Rudraprayag", "status": "Low", "floodProbability": 31, "estimatedLeadTime": 180},
            {"id": "VIL-010", "name": "Gopeshwar Terrace", "district": "Chamoli", "status": "Low", "floodProbability": 24, "estimatedLeadTime": 240},
            {"id": "VIL-011", "name": "Chamoli Sector", "district": "Chamoli", "status": "High", "floodProbability": 78, "estimatedLeadTime": 52},
            {"id": "VIL-012", "name": "Srinagar Garhwal Plain", "district": "Pauri Garhwal", "status": "Moderate", "floodProbability": 49, "estimatedLeadTime": 110}
        ]
        self.send_json(villages)

    def serve_village_detail(self, village_id):
        self.send_json({
            "id": village_id,
            "name": "Bhairavpur",
            "district": "Rudraprayag",
            "population": 1840,
            "status": "Critical",
            "floodProbability": 87,
            "estimatedLeadTime": 42,
            "nearbyRiver": "Mandakini River",
            "slope": "32°",
            "elevation": "1,480m MSL"
        })

    def serve_sensors(self):
        self.send_json([
            {"id": "UTK001", "type": "Rain Gauge", "village": "Bhairavpur", "value": "74 mm/hr", "battery": 82, "signal": "Strong", "status": "ONLINE"},
            {"id": "UTK002", "type": "Soil Moisture", "village": "Bhairavpur", "value": "86%", "battery": 76, "signal": "Strong", "status": "ONLINE"},
            {"id": "UTK003", "type": "Water Level", "village": "Bhairavpur", "value": "2.8 m", "battery": 91, "signal": "Strong", "status": "ONLINE"}
        ])

    def serve_alerts(self):
        self.send_json([
            {"id": "ALT-2026-104", "severity": "Critical", "village": "Bhairavpur", "title": "FLASH FLOOD WARNING", "probability": 87, "leadTime": "42 min", "status": "ACTIVE"},
            {"id": "ALT-2026-103", "severity": "Critical", "village": "Tilwara Basin", "title": "RAPID INUNDATION ADVISORY", "probability": 86, "leadTime": "36 min", "status": "ACTIVE"}
        ])

    def serve_events(self):
        self.send_json([
            {"id": "EVT-2023-04", "date": "14 Jul 2023", "location": "Bhairavpur & Mandakini Valley", "eventType": "Flash Flood", "severity": "Critical"}
        ])

def run_server(port=8000):
    handler = HimaGuardHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"================================================================")
        print(f"  HimaGuard Disaster Operations Server Running on Port {port}")
        print(f"  Web Dashboard: http://localhost:{port}/index.html")
        print(f"  Citizen Portal: http://localhost:{port}/citizen.html")
        print(f"  ML Scoring Endpoint: http://localhost:{port}/api/predict")
        print(f"================================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == '__main__':
    port = 8000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    run_server(port)
