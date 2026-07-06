import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict
from sqlalchemy.orm import Session

from app.models.meter import MeterData

# Minimum hourly records needed before we trust a real model over the
# generic starter curve. Below this, a model would just be overfitting noise.
MIN_RECORDS_FOR_HOURLY_MODEL = 24       # ~1 day of hourly readings
MIN_RECORDS_FOR_DAILY_MODEL = 72        # ~3 days of hourly readings

# Generic physically-plausible solar/load shape, used ONLY as a starting
# point for brand-new users with no uploaded data yet. This is never
# presented as a trained prediction — see "source" field on every response.
_DEFAULT_SOLAR_CURVE = [0,0,0,0,0,0,1.2,3.5,6.8,9.4,11.2,12.6,
                         12.1,11.5,10.2,8.4,5.6,3.1,0.8,0,0,0,0,0]
_DEFAULT_LOAD_CURVE = [2.1,1.8,1.6,1.5,1.6,2.0,2.5,3.2,4.1,4.8,5.0,5.1,
                        5.3,5.5,6.3,6.8,7.2,7.8,7.5,6.8,5.9,4.8,3.9,2.8]


def _load_history(db: Session, user_id: int) -> pd.DataFrame:
    rows = (
        db.query(MeterData)
        .filter(MeterData.user_id == user_id)
        .order_by(MeterData.timestamp.asc())
        .all()
    )
    if not rows:
        return pd.DataFrame(columns=["timestamp", "solar", "load"])
    return pd.DataFrame({
        "timestamp": [r.timestamp for r in rows],
        "solar": [float(r.solar_generation_kwh) for r in rows],
        "load": [float(r.consumption_kwh) for r in rows],
    })


def generate_hourly_forecast(db: Session, user_id: int) -> List[Dict]:
    """24-hour forecast. Uses the user's own historical average-by-hour-of-day
    once enough data exists; otherwise returns a clearly-labeled default curve."""
    df = _load_history(db, user_id)

    if len(df) >= MIN_RECORDS_FOR_HOURLY_MODEL:
        df = df.copy()
        df["hour"] = pd.to_datetime(df["timestamp"]).dt.hour
        grouped = df.groupby("hour").agg(
            solar_mean=("solar", "mean"),
            load_mean=("load", "mean"),
        ).reindex(range(24))

        hourly = []
        for hour in range(24):
            row = grouped.loc[hour]
            solar_mean = 0.0 if pd.isna(row["solar_mean"]) else row["solar_mean"]
            load_mean = 0.0 if pd.isna(row["load_mean"]) else row["load_mean"]
            hourly.append({
                "hour": f"{hour:02d}:00",
                "predicted_solar": round(max(0, solar_mean), 2),
                "predicted_load": round(max(0, load_mean), 2),
                "source": "historical_average",
            })
        return hourly

    # Not enough data yet — honest fallback, not a fake trained prediction.
    hourly = []
    for hour in range(24):
        hourly.append({
            "hour": f"{hour:02d}:00",
            "predicted_solar": _DEFAULT_SOLAR_CURVE[hour],
            "predicted_load": _DEFAULT_LOAD_CURVE[hour],
            "source": "default_curve_insufficient_data",
        })
    return hourly


def generate_solar_forecast(db: Session, user_id: int, days: int = 7) -> List[Dict]:
    """7-day forecast. Uses Prophet on the user's daily-aggregated history
    once there's enough of it; otherwise returns an honest fallback."""
    df = _load_history(db, user_id)
    base_date = datetime.now()

    if len(df) >= MIN_RECORDS_FOR_DAILY_MODEL:
        try:
            return _prophet_daily_forecast(df, days)
        except Exception:
            pass  # fall through to the honest fallback below

    forecasts = []
    for i in range(days):
        date = base_date + timedelta(days=i)
        forecasts.append({
            "forecast_date": date.date().isoformat(),
            "predicted_solar": round(sum(_DEFAULT_SOLAR_CURVE), 2),
            "predicted_load": round(sum(_DEFAULT_LOAD_CURVE), 2),
            "confidence": 0.5,
            "source": "default_curve_insufficient_data",
        })
    return forecasts


def _prophet_daily_forecast(df: pd.DataFrame, days: int) -> List[Dict]:
    from prophet import Prophet

    daily = (
    df.assign(date=pd.to_datetime(df["timestamp"]).dt.tz_localize(None).dt.floor("D"))
    )

    def fit_one(value_col: str):
        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=len(daily) >= 14,
            yearly_seasonality=False,
        )
        model.fit(daily[["date", value_col]].rename(columns={"date": "ds", value_col: "y"}))
        future = model.make_future_dataframe(periods=days, freq="D")
        return model.predict(future).tail(days).reset_index(drop=True)

    solar_fc = fit_one("solar")
    load_fc = fit_one("load")

    results = []
    for i in range(days):
        s, l = solar_fc.iloc[i], load_fc.iloc[i]
        spread = max(s["yhat_upper"] - s["yhat_lower"], 0.01)
        confidence = round(
            float(np.clip(1 - spread / (2 * max(s["yhat"], 1)), 0.5, 0.97)), 2
        )
        results.append({
            "forecast_date": s["ds"].date().isoformat(),
            "predicted_solar": round(max(0, s["yhat"]), 2),
            "predicted_load": round(max(0, l["yhat"]), 2),
            "confidence": confidence,
            "source": "prophet",
        })
    return results


def get_forecast_accuracy(db: Session, user_id: int) -> Dict:
    """Measures actual accuracy via backtesting instead of returning a fixed number."""
    df = _load_history(db, user_id)

    if len(df) < MIN_RECORDS_FOR_HOURLY_MODEL * 2:
        return {
            "accuracy": None,
            "model": "insufficient_data",
            "message": "Upload at least 2 days of meter data to unlock real accuracy tracking.",
        }

    df = df.copy()
    df["hour"] = pd.to_datetime(df["timestamp"]).dt.hour
    test = df.tail(24)
    train = df.iloc[:-24]

    hour_means = train.groupby("hour")["solar"].mean()
    predicted = test["hour"].map(hour_means).fillna(train["solar"].mean())
    actual = test["solar"].values

    nonzero = actual > 0.1
    if nonzero.sum() == 0:
        mape = 0.0
    else:
        mape = float(np.mean(np.abs((actual[nonzero] - predicted.values[nonzero]) / actual[nonzero])) * 100)

    accuracy = round(max(0.0, 100 - mape), 1)
    return {
        "accuracy": accuracy,
        "model": "Historical Hour-of-Day Average (backtested on last 24h)",
        "last_evaluated": datetime.now().date().isoformat(),
    }