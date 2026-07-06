from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from sqlalchemy import cast, Date
from typing import List
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.meter import MeterData
from app.models.user import User
from app.schemas.meter import MeterDataResponse, SurplusResponse
import csv
import io
from datetime import datetime, date

router = APIRouter(prefix="/meter", tags=["Meter Data"])

@router.post("/upload-csv")
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        content = await file.read()
        decoded = content.decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(decoded))
        records = []
        for row in reader:
            try:
                record = MeterData(
                    user_id=current_user.id,
                    timestamp=datetime.fromisoformat(row["timestamp"].strip()),
                    consumption_kwh=float(row["consumption_kwh"].strip()),
                    solar_generation_kwh=float(row.get("solar_generation_kwh", "0").strip())
                )
                db.add(record)
                records.append(record)
            except Exception:
                continue
        db.commit()
        return {"message": f"{len(records)} records uploaded successfully"}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@router.get("/data", response_model=List[MeterDataResponse])
def get_meter_data(
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(MeterData)
        .filter(MeterData.user_id == current_user.id)
        .order_by(MeterData.timestamp.desc())
        .limit(limit)
        .all()
    )

@router.get("/surplus", response_model=SurplusResponse)
def get_surplus(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()
    records = db.query(MeterData).filter(
        MeterData.user_id == current_user.id,
        cast(MeterData.timestamp, Date) == today
    ).all()

    if not records:
        records = (
            db.query(MeterData)
            .filter(MeterData.user_id == current_user.id)
            .order_by(MeterData.timestamp.desc())
            .limit(24)
            .all()
        )

    if not records:
        return SurplusResponse(
            solar_generated=0,
            consumed=0,
            surplus=0,
            export_revenue_estimate=0
        )

    solar = sum(r.solar_generation_kwh for r in records)
    consumed = sum(r.consumption_kwh for r in records)
    surplus = max(0, solar - consumed)

    return SurplusResponse(
        solar_generated=round(solar, 2),
        consumed=round(consumed, 2),
        surplus=round(surplus, 2),
        export_revenue_estimate=round(surplus * 4.5, 2)
    )