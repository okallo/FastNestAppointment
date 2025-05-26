from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.medical_record import MedicalRecordCreate, MedicalRecordOut
from app.models.medical_record import MedicalRecord
from app.models.user import User
from app.dependencies.db import get_db
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=MedicalRecordOut)
def create_record(record_in: MedicalRecordCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["doctor", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to create medical records")

    record = MedicalRecord(
        **record_in.dict(),
        doctor_id=current_user.id
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/patient/{patient_id}", response_model=list[MedicalRecordOut])
def get_patient_records(patient_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["doctor", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    records = db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient_id).all()
    return records

@router.get("/mine", response_model=list[MedicalRecordOut])
def get_my_created_records(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(MedicalRecord).filter(MedicalRecord.doctor_id == current_user.id).all()
