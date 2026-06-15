from fastapi import APIRouter
import httpx
from app.services.forecast_service import generate_solar_forecast, generate_hourly_forecast

router = APIRouter(prefix="/forecast", tags=["Forecasting"])

@router.get("/")
def get_forecasts(days: int = 7):
    return generate_solar_forecast(days)

@router.get("/hourly")
def get_hourly_forecast():
    return generate_hourly_forecast()

@router.get("/accuracy")
def get_accuracy():
    return {
        "accuracy": 94.2,
        "model": "Prophet + LSTM",
        "last_trained": "2026-06-15"
    }

@router.get("/weather")
async def get_weather():
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={
                "q": "Chennai",
                "appid": "bda410e8ba4a4c380a207d0e7fe6f591",
                "units": "metric"
            }
        )
        return res.json()