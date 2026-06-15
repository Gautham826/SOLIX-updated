import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict

def generate_solar_forecast(days: int = 7) -> List[Dict]:
    """Generate solar generation forecast using synthetic data + Prophet-style output"""
    forecasts = []
    base_date = datetime.now()
    
    # Simulate solar pattern (peaks at midday, weather variation)
    for i in range(days):
        date = base_date + timedelta(days=i)
        # Base solar varies by day with some randomness
        base_solar = 42 + np.random.normal(0, 5)
        base_load = 28 + np.random.normal(0, 3)
        confidence = round(np.random.uniform(0.88, 0.97), 2)
        
        forecasts.append({
            "forecast_date": date.date().isoformat(),
            "predicted_solar": round(max(0, base_solar), 2),
            "predicted_load": round(max(0, base_load), 2),
            "confidence": confidence
        })
    
    return forecasts

def generate_hourly_forecast() -> List[Dict]:
    """Generate 24-hour forecast"""
    hourly = []
    solar_curve = [0,0,0,0,0,0,1.2,3.5,6.8,9.4,11.2,12.6,
                   12.1,11.5,10.2,8.4,5.6,3.1,0.8,0,0,0,0,0]
    load_curve =  [2.1,1.8,1.6,1.5,1.6,2.0,2.5,3.2,4.1,4.8,5.0,5.1,
                   5.3,5.5,6.3,6.8,7.2,7.8,7.5,6.8,5.9,4.8,3.9,2.8]
    
    for hour in range(24):
        noise_s = np.random.normal(0, 0.3)
        noise_l = np.random.normal(0, 0.2)
        hourly.append({
            "hour": f"{hour:02d}:00",
            "predicted_solar": round(max(0, solar_curve[hour] + noise_s), 2),
            "predicted_load": round(max(0, load_curve[hour] + noise_l), 2),
        })
    
    return hourly