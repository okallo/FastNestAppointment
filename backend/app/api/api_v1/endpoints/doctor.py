from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.doctor import Doctor
from app.schemas.doctor import DoctorCreate, DoctorOut
from app.dependencies.auth import get_current_user, require_role
from app.models.user import Role, User
from app.schemas.availability import AvailabilityResponse
from app.models.appointment import Appointment, AppointmentStatus
from app.models.timeoff import DoctorTimeOff
from app.schemas.timeoff import TimeOffCreate


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
#@router.post("/", dependencies=[Depends(require_role([Role.doctor, Role.admin]))])
@router.post("/", response_model=DoctorOut)
def create_doctor(payload: DoctorCreate, db: Session = Depends(get_db)):
    doctor = Doctor(**payload.dict())
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return doctor

@router.get("/", response_model=list[DoctorOut])
def list_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).all()

@router.post("/doctors/time_off", status_code=201)
def set_doctor_time_off(payload: TimeOffCreate, db: Session = Depends(get_db)):
    time_off = DoctorTimeOff(**payload.dict())
    db.add(time_off)
    db.commit()
    return {"message": "Time off set successfully"}

