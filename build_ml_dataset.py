import os
import pandas as pd
import xarray as xr
import numpy as np

# Paths
landslide_csv = r"data\landslides_study_area.csv"
era5_nc = r"data\era5_land_soil_hydrology_2021_merged.nc"

# 1. Load Datasets
df_landslides = pd.read_csv(landslide_csv)
ds_era5 = xr.open_dataset(era5_nc)

print(f"Loaded {len(df_landslides)} hazard points and ERA5 time-series dataset.")

# 2. Extract Hydrological Features at Hazard Locations
processed_records = []

for idx, row in df_landslides.iterrows():
    lat, lon, date = row['latitude'], row['longitude'], row['event_date']
    
    # Query nearest ERA5 grid cell
    sub_ds = ds_era5.sel(latitude=lat, longitude=lon, method='nearest')
    
    # 24-hour total rainfall (convert m to mm)
    p_24h = sub_ds['tp'].sel(time=slice(f"{date} 00:00", f"{date} 23:00")).sum().values * 1000.0
    
    # 3-day Antecedent Rainfall (72 hours prior)
    start_date = (pd.to_datetime(date) - pd.Timedelta(days=3)).strftime('%Y-%m-%d')
    p_3day = sub_ds['tp'].sel(time=slice(f"{start_date} 00:00", f"{date} 23:00")).sum().values * 1000.0
    
    # Soil moisture content
    sm_top = sub_ds['swvl1'].sel(time=slice(f"{date} 00:00", f"{date} 23:00")).mean().values
    
    processed_records.append({
        'event_title': row['event_title'],
        'latitude': lat,
        'longitude': lon,
        'event_date': date,
        'precip_24h_mm': round(float(p_24h), 2),
        'precip_3day_api_mm': round(float(p_3day), 2),
        'soil_moisture_swvl1': round(float(sm_top), 4),
        'target': 1
    })

feature_df = pd.DataFrame(processed_records)
out_path = r"data\hazard_hydrology_features.csv"
feature_df.to_csv(out_path, index=False)

print("\n--- EXTRACTED HYDROLOGICAL FEATURES AT HAZARD POINTS ---")
print(feature_df[['event_title', 'event_date', 'precip_24h_mm', 'precip_3day_api_mm', 'soil_moisture_swvl1']])
print(f"\nSaved feature table to: {out_path}")