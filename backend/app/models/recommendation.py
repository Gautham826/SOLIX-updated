from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    recommendation = Column(String, nullable=False)
    saving_amount = Column(Float, default=0.0)
    action_time = Column(String)
    priority = Column(String, default="medium")
    created_at = Column(DateTime(timezone=True), server_default=func.now())