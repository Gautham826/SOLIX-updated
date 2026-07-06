from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.recommendation import Recommendation
from app.models.user import User
from typing import List

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/")
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    recs = (
        db.query(Recommendation)
        .filter(Recommendation.user_id == current_user.id)
        .order_by(Recommendation.created_at.desc())
        .limit(10)
        .all()
    )
    if not recs:
        return _mock_recommendations()
    return recs

def _mock_recommendations():
    return [
        {"id": 1, "recommendation": "Export 7.6 kWh to IEX DAM", "saving_amount": 342, "action_time": "14:00–15:00", "priority": "high"},
        {"id": 2, "recommendation": "Run heavy machinery during solar peak", "saving_amount": 180, "action_time": "12:00–14:00", "priority": "high"},
        {"id": 3, "recommendation": "Charge battery before evening peak", "saving_amount": 95, "action_time": "13:00–15:00", "priority": "medium"},
        {"id": 4, "recommendation": "Shift AC usage to solar hours", "saving_amount": 65, "action_time": "11:00–13:00", "priority": "medium"},
    ]