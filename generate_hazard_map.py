import os
import glob
import numpy as np
import pandas as pd
import xarray as xr
import rasterio
from rasterio.transform import from_origin
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
import xgboost as xgb

# Set random seeds
np.random.seed(42)

# File paths
data_dir = "data"
ml_csv_path = os.path.join(data_dir, "ml_balanced_dataset_with_dem.csv")
era5_nc = os.path.join(data_dir, "era5_land_soil_hydrology_2021_merged.nc")
output_tif = os.path.join(data_dir, "hazard_susceptibility_2021.tif")
output_png = os.path.join(data_dir, "hazard_susceptibility_map.png")

print("--- STEP 1: RETRAINING MODEL 2 (HYDROLOGY + DEM) ---")
if not os.path.exists(ml_csv_path):
    raise FileNotFoundError(f"Missing {ml_csv_path}. Please run enrich_and_retrain.py first!")

df_train = pd.read_csv(ml_csv_path)
feature_cols = ['precip_24h_mm', 'precip_3day_api_mm', 'soil_moisture_swvl1', 'elevation_m', 'slope_deg']

X = df_train[feature_cols]
y = df_train['target']

# Train Model 2
model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=3,
    learning_rate=0.05,
    eval_metric='logloss',
    random_state=42
)
model.fit(X, y)
print("Successfully trained XGBoost Model 2!")

print("\n--- STEP 2: LOADING ERA5 HYDROLOGICAL GRID ---")
ds = xr.open_dataset(era5_nc)

lats = ds['latitude'].values
lons = ds['longitude'].values

# Calculate worst-case (peak event) hydrological drivers for 2021 across each pixel
print("Aggregating 2021 maximum 24h precipitation, 3-day API, and peak soil moisture...")
daily_tp = ds['tp'].resample(time='1D').sum() * 1000.0  # convert m to mm
max_p24 = daily_tp.max(dim='time').values

# 3-day Antecedent Precipitation Index (API) max
api_3day = daily_tp.rolling(time=3, min_periods=1).sum()
max_p3day = api_3day.max(dim='time').values

# Peak soil moisture
max_sm = ds['swvl1'].resample(time='1D').mean().max(dim='time').values

print("\n--- STEP 3: EXTRACTING DEM TOPOGRAPHY FOR GRID ---")
# Check for DEM file
dem_candidates = glob.glob("*.tif") + glob.glob("*.dem") + glob.glob(f"{data_dir}/*.tif") + glob.glob(f"{data_dir}/*.dem")

grid_lon, grid_lat = np.meshgrid(lons, lats)
grid_elev = np.zeros_like(grid_lat, dtype=float)
grid_slope = np.zeros_like(grid_lat, dtype=float)

if dem_candidates:
    dem_file = dem_candidates[0]
    print(f"Sampling DEM topography from raster: {dem_file}")
    with rasterio.open(dem_file) as src:
        dem_data = src.read(1).astype(float)
        transform = src.transform
        
        cellsize_x = abs(transform[0]) * (111320.0 if src.crs and src.crs.is_geographic else 1.0)
        cellsize_y = abs(transform[4]) * (111320.0 if src.crs and src.crs.is_geographic else 1.0)
        
        # Calculate slope map from DEM
        dy, dx = np.gradient(dem_data, cellsize_y, cellsize_x)
        slope_map = np.degrees(np.arctan(np.sqrt(dx**2 + dy**2)))
        
        for i in range(len(lats)):
            for j in range(len(lons)):
                py, px = src.index(lons[j], lats[i])
                py = max(0, min(py, dem_data.shape[0] - 1))
                px = max(0, min(px, dem_data.shape[1] - 1))
                grid_elev[i, j] = max(0, float(dem_data[py, px]))
                grid_slope[i, j] = max(0, float(slope_map[py, px]))
else:
    print("⚠️ No local DEM file found. Applying topographic estimation across Garhwal grid...")
    for i in range(len(lats)):
        for j in range(len(lons)):
            grid_elev[i, j] = max(400, 1500 + (lats[i] - 30.2) * 2500 + (lons[j] - 79.3) * 1200)
            grid_slope[i, j] = max(3.0, 15.0 + (lats[i] - 30.0) * 20.0 + np.random.normal(0, 3))

print("\n--- STEP 4: RUNNING MODEL 2 INFERENCE ACROSS EVERY PIXEL ---")
n_lat, n_lon = len(lats), len(lons)
risk_map = np.zeros((n_lat, n_lon), dtype=float)

# Flatten grid for fast vector inference
flat_features = pd.DataFrame({
    'precip_24h_mm': max_p24.flatten(),
    'precip_3day_api_mm': max_p3day.flatten(),
    'soil_moisture_swvl1': max_sm.flatten(),
    'elevation_m': grid_elev.flatten(),
    'slope_deg': grid_slope.flatten()
})

# Replace NaN/Inf if any
flat_features = flat_features.fillna(0)

# Predict hazard probabilities
probs = model.predict_proba(flat_features)[:, 1]
risk_map = probs.reshape((n_lat, n_lon))

print(f"Inference complete! Risk probability range: Min = {risk_map.min():.4f}, Max = {risk_map.max():.4f}")

print("\n--- STEP 5: EXPORTING HIGH-RESOLUTION GEOTIFF ---")
# Define GeoTIFF spatial bounds & transform
lon_min, lon_max = lons.min(), lons.max()
lat_min, lat_max = lats.min(), lats.max()
res_x = (lon_max - lon_min) / (n_lon - 1) if n_lon > 1 else 0.1
res_y = (lat_max - lat_min) / (n_lat - 1) if n_lat > 1 else 0.1

transform = from_origin(lon_min - res_x / 2, lat_max + res_y / 2, res_x, res_y)

with rasterio.open(
    output_tif,
    'w',
    driver='GTiff',
    height=n_lat,
    width=n_lon,
    count=1,
    dtype=risk_map.dtype,
    crs='EPSG:4326',
    transform=transform,
) as dst:
    dst.write(risk_map, 1)

print(f"Saved GeoTIFF hazard susceptibility map to: {output_tif}")

print("\n--- STEP 6: PLOTTING HAZARD MAP ---")
plt.figure(figsize=(10, 8))
plt.contourf(lons, lats, risk_map, levels=15, cmap='YlOrRd')
cbar = plt.colorbar(label='Hazard Probability Score (0.0 = Low, 1.0 = High Hazard)')

# Plot historical hazard points on top
df_pos = df_train[df_train['target'] == 1]
plt.scatter(df_pos['longitude'], df_pos['latitude'], color='blue', edgecolors='white', 
            s=60, label='Historical Hazard Events', zorder=5)

plt.title('Uttarakhand Flash Flood & Landslide Susceptibility Map (Model 2)', fontsize=12, fontweight='bold')
plt.xlabel('Longitude (°E)', fontsize=11)
plt.ylabel('Latitude (°N)', fontsize=11)
plt.grid(True, linestyle='--', alpha=0.5)
plt.legend(loc='lower left', frameon=True, facecolor='white')

plt.tight_layout()
plt.savefig(output_png, dpi=300)
print(f"Saved Susceptibility Plot to: {output_png}")
plt.show()