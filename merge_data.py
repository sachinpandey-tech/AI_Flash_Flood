import glob
import xarray as xr

file_paths = sorted(glob.glob(r"data\raw\*_extracted.nc"))
print(f"Found {len(file_paths)} extracted monthly files. Merging...")

# Load individual monthly datasets
datasets = [xr.open_dataset(p, engine='netcdf4') for p in file_paths]

# Clean each month by dropping scalar 'time' and squeezable extra dimensions
cleaned_datasets = []
for ds in datasets:
    # Drop 'time' if it conflicts with 'valid_time'
    if 'time' in ds.coords or 'time' in ds.dims:
        ds = ds.drop_vars('time', errors='ignore')
    cleaned_datasets.append(ds)

# Concatenate cleanly along valid_time
merged_ds = xr.concat(cleaned_datasets, dim='valid_time')

# Sort by time to ensure strictly chronological order
merged_ds = merged_ds.sortby('valid_time')

# Rename valid_time to standard 'time' for convenience
merged_ds = merged_ds.rename({'valid_time': 'time'})

print("\n--- MERGED DATASET SUMMARY ---")
print(merged_ds)

# Save the clean dataset
output_path = r"data\era5_land_soil_hydrology_2021_merged.nc"
merged_ds.to_netcdf(output_path)
print(f"\nSaved clean merged dataset to: {output_path}")