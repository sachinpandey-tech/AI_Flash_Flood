# Save as simulate_esp32_iot.py
import requests
import time
import random

SPRING_BOOT_URL = "http://localhost:8080/api/hazard/assess"

# Simulated GPS coordinates for Chamoli district villages
villages = [
    {"name": "Joshimath", "lat": 30.5520, "lon": 79.5630},
    {"name": "Badrinath", "lat": 30.7438, "lon": 79.4938},
    {"name": "Gopeshwar", "lat": 30.4088, "lon": 79.3245},
    {"name": "Pipalkoti", "lat": 30.4300, "lon": 79.4300}
]

print("Starting ESP32 IoT GPS Simulation Stream...\n")

while True:
    target = random.choice(villages)
    print(f"[ESP32 SIMULATOR] Transmitting GPS Ping for {target['name']}...")
    
    response = requests.post(SPRING_BOOT_URL, params={"lat": target['lat'], "lon": target['lon']})
    
    if response.status_code == 200:
        print(f"[SUCCESS] Spring Boot processed assessment and saved to DB!")
    else:
        print(f"[ERROR] Failed to store record: {response.status_code}")
        
    time.sleep(10)  # Wait 10 seconds before next ping