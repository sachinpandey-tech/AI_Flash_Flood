import os
import random
import numpy as np
import pandas as pd
import xarray as xr
import matplotlib.pyplot as plt

# ML Libraries
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
import xgboost as xgb

# Set random seeds for reproducibility
np.random.seed(42)
random.seed(42)

# Output directory
output_dir = "data"
os.makedirs(output_dir, exist_ok=True)

# File paths
positive_csv = os.path.join(output_dir, "hazard_hydrology_features.csv")
era5_nc = os.path.join(output_dir, "era5_land_soil_hydrology_2021_merged.nc")

print("--- STEP 1: LOADING POSITIVE SAMPLES (TARGET = 1) ---")
df_pos = pd.read_csv(positive_csv)
print(f"Loaded {len(df_pos)} historical hazard points (target = 1).")

print("\n--- STEP 2: GENERATING NEGATIVE BACKGROUND SAMPLES (TARGET = 0) ---")
ds_era5 = xr.open_dataset(era5_nc)

lats = ds_era5['latitude'].values
lons = ds_era5['longitude'].values
time_series = pd.to_datetime(ds_era5['time'].values)

# Unique dates in 2021
unique_dates = pd.Series(time_series.strftime('%Y-%m-%d')).unique()

# Generate matching number of negative non-event samples
negative_records = []
num_negatives_needed = len(df_pos) * 2  # 2x ratio for stable background baseline

attempts = 0
while len(negative_records) < num_negatives_needed and attempts < 1000:
    attempts += 1
    
    # Pick random location and random date
    rand_lat = np.random.choice(lats)
    rand_lon = np.random.choice(lons)
    rand_date = np.random.choice(unique_dates)
    
    # Query ERA5 at this location and date
    sub_ds = ds_era5.sel(latitude=rand_lat, longitude=rand_lon, method='nearest')
    
    p_24h = sub_ds['tp'].sel(time=slice(f"{rand_date} 00:00", f"{rand_date} 23:00")).sum().values * 1000.0
    
    # Select non-event condition (low/moderate rainfall day)
    if p_24h < 15.0:  # Days with under 15mm precipitation
        start_date = (pd.to_datetime(rand_date) - pd.Timedelta(days=3)).strftime('%Y-%m-%d')
        
        try:
            p_3day = sub_ds['tp'].sel(time=slice(f"{start_date} 00:00", f"{rand_date} 23:00")).sum().values * 1000.0
            sm_top = sub_ds['swvl1'].sel(time=slice(f"{rand_date} 00:00", f"{rand_date} 23:00")).mean().values
            
            negative_records.append({
                'event_title': f'Non_Event_{len(negative_records)+1}',
                'latitude': float(rand_lat),
                'longitude': float(rand_lon),
                'event_date': rand_date,
                'precip_24h_mm': round(float(p_24h), 2),
                'precip_3day_api_mm': round(float(p_3day), 2),
                'soil_moisture_swvl1': round(float(sm_top), 4),
                'target': 0  # Negative label
            })
        except KeyError:
            continue

df_neg = pd.DataFrame(negative_records)
print(f"Generated {len(df_neg)} stable baseline background points (target = 0).")

# 3. Combine into final ML Dataset
df_full = pd.concat([df_pos, df_neg], ignore_index=True)
ml_csv_path = os.path.join(output_dir, "ml_balanced_dataset.csv")
df_full.to_csv(ml_csv_path, index=False)
print(f"\nSaved complete balanced ML dataset to: {ml_csv_path}")

print("\n--- STEP 3: TRAINING XGBOOST HAZARD MODEL ---")

# Define features (X) and label (y)
feature_cols = ['precip_24h_mm', 'precip_3day_api_mm', 'soil_moisture_swvl1']
X = df_full[feature_cols]
y = df_full['target']

# Train/Test Split (70% train, 30% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.30, random_state=42, stratify=y
)

# Initialize XGBoost Classifier
model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=3,
    learning_rate=0.05,
    eval_metric='logloss',
    random_state=42
)

# Train the model
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)
y_probs = model.predict_proba(X_test)[:, 1]

print("\n================ MODEL PERFORMANCE ================")
print(f"ROC-AUC Score: {roc_auc_score(y_test, y_probs):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Safe (0)', 'Hazard (1)']))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# --- STEP 4: PLOT FEATURE IMPORTANCE ---
print("\n--- STEP 4: PLOTTING FEATURE IMPORTANCE ---")
importance = model.feature_importances_
feature_names = ['24h Rainfall (mm)', '3-Day Antecedent Rain (mm)', 'Topsoil Moisture (m³/m³)']

plt.figure(figsize=(8, 5))
bars = plt.barh(feature_names, importance, color=['#3498db', '#2ecc71', '#e74c3c'])
plt.xlabel('XGBoost Relative Feature Importance Score', fontsize=11)
plt.title('Drivers of Flash Flood & Landslide Risk in Uttarakhand', fontsize=12, fontweight='bold')
plt.xlim(0, 1.0)
plt.grid(axis='x', linestyle='--', alpha=0.7)

# Annotate bar values
for bar in bars:
    width = bar.get_width()
    plt.text(width + 0.02, bar.get_y() + bar.get_height()/2, f'{width*100:.1f}%', 
             va='center', ha='left', fontsize=10, fontweight='bold')

plt.tight_layout()
chart_path = os.path.join(output_dir, "feature_importance.png")
plt.savefig(chart_path, dpi=300)
print(f"Saved Feature Importance Chart to: {chart_path}")
plt.show()