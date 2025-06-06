from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.patient import PatientCreate, PatientOut
from app.models import patient as models
from app.models.user import User, Role
from app.db.session import SessionLocal
from uuid import UUID

from app.core.security import get_password_hash
router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PatientOut)
def register_patient(payload: PatientCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(
        email=payload.email,
        username=payload.username,
        hashed_password=get_password_hash(payload.password),
        role=Role.patient
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    patient = models.Patient(user_id=user.id, insurance_number=payload.insurance_number)
    db.add(patient)
    db.commit()
    db.refresh(patient)

    return patient

@router.get("/all", response_model=List[PatientOut])
def get_patients(db: Session = Depends(get_db)):
    patients = db.query(models.Patient).all()
    return patients

@router.get("/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: UUID, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient
