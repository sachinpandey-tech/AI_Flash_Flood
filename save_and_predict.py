import os
import joblib
import pandas as pd
import numpy as np
import xgboost as xgb

# File Paths
data_dir = "data"
model_dir = "models"
os.makedirs(model_dir, exist_ok=True)

csv_path = os.path.join(data_dir, "ml_balanced_dataset_with_dem.csv")
model_path = os.path.join(model_dir, "hazard_xgboost_model.joblib")

# ------------------------------------------------------------------------------
# 1. TRAIN & SERIALIZE MODEL 2 PIPELINE
# ------------------------------------------------------------------------------
def train_and_save_model():
    print("--- STEP 1: TRAINING & SAVING HAZARD PREDICTION MODEL ---")
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Missing dataset at {csv_path}. Run enrich_and_retrain.py first!")

    df = pd.read_csv(csv_path)
    feature_cols = ['precip_24h_mm', 'precip_3day_api_mm', 'soil_moisture_swvl1', 'elevation_m', 'slope_deg']

    X = df[feature_cols]
    y = df['target']

    # Train XGBoost Model
    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=3,
        learning_rate=0.05,
        eval_metric='logloss',
        random_state=42
    )
    model.fit(X, y)

    # Save model and metadata pipeline
    pipeline = {
        'model': model,
        'feature_names': feature_cols
    }
    
    joblib.dump(pipeline, model_path)
    print(f"Model pipeline successfully saved to: {model_path}\n")

# ------------------------------------------------------------------------------
# 2. INTERACTIVE RISK PREDICTION CLI
# ------------------------------------------------------------------------------
def predict_hazard_risk(precip_24h, precip_3day, soil_moisture, elevation, slope):
    """Loads saved model and returns risk probability score and alert level."""
    if not os.path.exists(model_path):
        train_and_save_model()

    pipeline = joblib.load(model_path)
    model = pipeline['model']
    feature_names = pipeline['feature_names']

    # Input DataFrame construction
    input_data = pd.DataFrame([[precip_24h, precip_3day, soil_moisture, elevation, slope]], columns=feature_names)

    # Risk Probability Prediction
    prob = model.predict_proba(input_data)[0, 1]
    risk_percentage = prob * 100

    # Risk Level Determination
    if risk_percentage >= 75.0:
        alert_level = "🔴 HIGH HAZARD RISK (Flash Flood / Landslide Likely)"
    elif risk_percentage >= 45.0:
        alert_level = "🟠 MODERATE HAZARD RISK (Elevated Saturation / Runoff)"
    else:
        alert_level = "🟢 LOW HAZARD RISK (Stable Conditions)"

    return risk_percentage, alert_level

def run_interactive_cli():
    print("==========================================================================")
    print("      UTTARAKHAND FLASH FLOOD & LANDSLIDE REAL-TIME RISK PREDICTOR        ")
    print("==========================================================================")
    print("Enter environmental parameters below to query the trained XGBoost model.")
    print("Type 'exit' or 'q' at any prompt to quit.\n")

    while True:
        try:
            p24_in = input("Enter 24-Hour Rainfall (mm) [e.g., 45.0]: ").strip()
            if p24_in.lower() in ['exit', 'q']: break

            p3d_in = input("Enter 3-Day Antecedent Rainfall (mm) [e.g., 80.0]: ").strip()
            if p3d_in.lower() in ['exit', 'q']: break

            sm_in = input("Enter Topsoil Moisture (0.00 to 0.50 m³/m³) [e.g., 0.35]: ").strip()
            if sm_in.lower() in ['exit', 'q']: break

            elev_in = input("Enter Elevation (meters) [e.g., 1800]: ").strip()
            if elev_in.lower() in ['exit', 'q']: break

            slope_in = input("Enter Slope Angle (degrees) [e.g., 32.0]: ").strip()
            if slope_in.lower() in ['exit', 'q']: break

            # Convert to numerical floats
            precip_24h = float(p24_in)
            precip_3day = float(p3d_in)
            soil_moisture = float(sm_in)
            elevation = float(elev_in)
            slope = float(slope_in)

            # Predict
            risk_pct, alert = predict_hazard_risk(precip_24h, precip_3day, soil_moisture, elevation, slope)

            print("\n------------------------- PREDICTION RESULT -------------------------")
            print(f" Calculated Hazard Probability : {risk_pct:.2f}%")
            print(f" Status                        : {alert}")
            print("---------------------------------------------------------------------\n")

        except ValueError:
            print("\n⚠️ Invalid input format! Please enter valid numeric values.\n")
        except KeyboardInterrupt:
            print("\nExiting Predictor...")
            break

if __name__ == "__main__":
    train_and_save_model()
    run_interactive_cli()