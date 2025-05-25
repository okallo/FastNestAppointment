from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.patient import PatientCreate, PatientOut
from app.models import patient as models
from app.db.session import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PatientOut)
def register_patient(payload: PatientCreate, db: Session = Depends(get_db)):
    patient = models.Patient(**payload.dict())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient
