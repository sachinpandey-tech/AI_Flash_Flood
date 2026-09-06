import matplotlib.pyplot as plt
import numpy as np
import rasterio

# Load the downloaded DEM GeoTIFF file
with rasterio.open("data/DEM.tif") as src:
    dem_data = src.read(1)
    
    # Replace nodata values with NaN for clean visualization
    dem_data = np.where(dem_data == src.nodata, np.nan, dem_data)

# Print elevation statistics
print(f"Min Elevation: {np.nanmin(dem_data):.2f} meters")
print(f"Max Elevation: {np.nanmax(dem_data):.2f} meters")

# Plot terrain with terrain color mapping
plt.figure(figsize=(10, 8))
plt.imshow(dem_data, cmap="terrain")
plt.colorbar(label="Elevation (meters above sea level)")
plt.title("Uttarakhand Chamoli Study Area - Digital Elevation Model")
plt.xlabel("Pixels (X)")
plt.ylabel("Pixels (Y)")
plt.savefig("processed_dem_map.png", dpi=300)
plt.show()