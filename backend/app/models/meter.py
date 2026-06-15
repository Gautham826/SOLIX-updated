from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class MeterData(Base):
    __tablename__ = "meter_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    consumption_kwh = Column(Float, nullable=False)
    solar_generation_kwh = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())