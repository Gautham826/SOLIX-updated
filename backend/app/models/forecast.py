from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Date
from sqlalchemy.sql import func
from app.core.database import Base

class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    forecast_date = Column(Date, nullable=False)
    predicted_load = Column(Float, nullable=False)
    predicted_solar = Column(Float, nullable=False)
    confidence = Column(Float, default=0.9)
    created_at = Column(DateTime(timezone=True), server_default=func.now())