import cdsapi
import os

c = cdsapi.Client()

# Ensure output directory exists
os.makedirs('data/raw', exist_ok=True)

# Bounding Box: [North, West, South, East]
STUDY_AREA = [30.90, 79.20, 30.20, 79.90]

months = [f"{m:02d}" for m in range(1, 13)]

for month in months:
    print(f"Downloading month {month}...")
    c.retrieve(
        'reanalysis-era5-land',
        {
            'format': 'netcdf',
            'variable': [
                'volumetric_soil_water_layer_1',
                'volumetric_soil_water_layer_2',
                'total_precipitation',
                # Add any other required variables here
            ],
            'year': '2021',
            'month': month,
            'day': [f"{d:02d}" for d in range(1, 32)],
            'time': [f"{h:02d}:00" for h in range(24)],
            'area': STUDY_AREA,  # Cuts data to your study area!
        },
        f'data/raw/era5_land_soil_hydrology_2021_{month}.nc'
    )

print("All 12 months downloaded successfully!")