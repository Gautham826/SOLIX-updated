from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx
from app.core.config import settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.services.forecast_service import (
    generate_solar_forecast,
    generate_hourly_forecast,
    get_forecast_accuracy,
)

router = APIRouter(prefix="/forecast", tags=["Forecasting"])

@router.get("/")
def get_forecasts(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_solar_forecast(db, current_user.id, days)

@router.get("/hourly")
def get_hourly_forecast(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_hourly_forecast(db, current_user.id)

@router.get("/accuracy")
def get_accuracy(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_forecast_accuracy(db, current_user.id)

@router.get("/weather")
async def get_weather():
    if not settings.OPENWEATHER_API_KEY:
        raise HTTPException(status_code=503, detail="Weather API key not configured")
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={
                "q": "Chennai",
                "appid": settings.OPENWEATHER_API_KEY,
                "units": "metric",
            },
        )
        return res.json()