import os
import xarray as xr
import pandas as pd
import numpy as np

# 1. Load your clean merged ERA5 dataset
ds_path = r"data\era5_land_soil_hydrology_2021_merged.nc"
output_dir = "data"
os.makedirs(output_dir, exist_ok=True)

print(f"Loading merged dataset from {ds_path}...")
ds = xr.open_dataset(ds_path)

# 2. Convert Total Precipitation (tp) from meters to millimeters (mm)
# Note: ERA5 hourly tp is accumulated precipitation per hour
rain_mm = ds['tp'] * 1000.0  # m -> mm
rain_mm.attrs['units'] = 'mm/hr'
rain_mm.attrs['long_name'] = 'Hourly Total Precipitation'

# 3. Spatial Aggregation: Calculate domain-average hourly rainfall across the grid
domain_hourly_rain = rain_mm.mean(dim=['latitude', 'longitude']).to_series()

# 4. Daily Aggregation: Calculate total daily precipitation (mm/day)
daily_rain = rain_mm.resample(time='1D').sum(dim='time')
domain_daily_rain = daily_rain.mean(dim=['latitude', 'longitude']).to_series()

# 5. Extract Extreme Rain Events (Top 10 days in 2021)
top_10_days = domain_daily_rain.sort_values(ascending=False).head(10)

print("\n--- TOP 10 HEAVIEST RAINFALL DAYS IN 2021 (Domain Average) ---")
for date, amount in top_10_days.items():
    print(f"{date.strftime('%Y-%m-%d')}: {amount:.2f} mm/day")

# 6. Save Processed Rainfall Data to CSV
# A. Full Hourly Time-Series (Domain Average)
hourly_csv_path = os.path.join(output_dir, "rainfall_hourly_2021.csv")
domain_hourly_rain.to_csv(hourly_csv_path, header=['precip_mm_hr'])
print(f"\nSaved hourly rain time-series to: {hourly_csv_path}")

# B. Daily Totals Summary
daily_csv_path = os.path.join(output_dir, "rainfall_daily_2021.csv")
domain_daily_rain.to_csv(daily_csv_path, header=['precip_mm_day'])
print(f"Saved daily rain totals to: {daily_csv_path}")

# C. Grid-by-Grid Flattened Table (For spatial modeling/ML)
df_grid = rain_mm.to_dataframe().reset_index()
df_grid_csv_path = os.path.join(output_dir, "rainfall_grid_spatial_2021.csv")
df_grid.to_csv(df_grid_csv_path, index=False)
print(f"Saved spatial grid rain table to: {df_grid_csv_path}")