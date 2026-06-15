from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MeterDataCreate(BaseModel):
    timestamp: datetime
    consumption_kwh: float
    solar_generation_kwh: float = 0.0

class MeterDataResponse(BaseModel):
    id: int
    user_id: int
    timestamp: datetime
    consumption_kwh: float
    solar_generation_kwh: float

    class Config:
        from_attributes = True

class SurplusResponse(BaseModel):
    solar_generated: float
    consumed: float
    surplus: float
    export_revenue_estimate: float