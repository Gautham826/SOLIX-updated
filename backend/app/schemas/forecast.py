from pydantic import BaseModel
from datetime import date, datetime
from typing import List

class ForecastResponse(BaseModel):
    id: int
    forecast_date: date
    predicted_load: float
    predicted_solar: float
    confidence: float

    class Config:
        from_attributes = True

class ForecastList(BaseModel):
    forecasts: List[ForecastResponse]
    accuracy: float