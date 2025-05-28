from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.doctor import Doctor
from app.schemas.doctor import DoctorCreate, DoctorOut
from app.dependencies.auth import get_current_user, require_role
from app.models.user import Role, User
from app.schemas.availability import AvailabilityOut
from app.models.appointment import Appointment, AppointmentStatus
from app.models.timeoff import DoctorTimeOff
from app.schemas.timeoff import TimeOffCreate, TimeOffUpdate, TimeOffOut
from app.core.security import get_password_hash


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=DoctorOut, dependencies=[Depends(require_role([Role.admin]))])
def create_doctor(payload: DoctorCreate, db: Session = Depends(get_db)):
    # First create the user
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Doctor with this email already exists")

    user = User(
        email=payload.email,
        username=payload.username,
        hashed_password=get_password_hash(payload.password),
        role=Role.doctor
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    doctor = Doctor(user_id=user.id, specialization=payload.specialization, availability=payload.availability)
    db.add(doctor)
    db.commit()
    db.refresh(doctor)

    return doctor

@router.get("/", response_model=list[DoctorOut], dependencies=[Depends(require_role([Role.admin, Role.doctor]))])
def list_doctors(db: Session = Depends(get_db)):
    return db.query(Doctor).all()

@router.post("/time_off", status_code=201,response_model=TimeOffOut, dependencies=[Depends(require_role([Role.doctor]))])
def set_doctor_time_off(payload: TimeOffCreate, db: Session = Depends(get_db)):
    time_off = DoctorTimeOff(**payload.dict())
    db.add(time_off)
    db.commit()
    return {"message": "Time off set successfully"}

@router.get("/{doctor_id}/time_off", response_model=List[TimeOffOut], dependencies=[Depends(require_role([Role.admin, Role.doctor]))])
def get_doctor_time_off(doctor_id: UUID, db: Session = Depends(get_db)):
    return db.query(DoctorTimeOff).filter(DoctorTimeOff.doctor_id == doctor_id).all()

@router.patch("/time_off/{time_off_id}", response_model=TimeOffOut, dependencies=[Depends(require_role([Role.admin, Role.doctor]))])
def update_time_off(time_off_id: UUID, payload: TimeOffUpdate, db: Session = Depends(get_db)):
    time_off = db.query(DoctorTimeOff).filter(DoctorTimeOff.id == time_off_id).first()
    if not time_off:
        raise HTTPException(status_code=404, detail="Time off not found")
    
    if get_current_user.role == Role.doctor and get_current_user.id == time_off.doctor_id:
        raise HTTPException(status_code=403, detail="Doctors cannot approve/reject their own time off")

    for key, value in payload.dict(exclude_unset=True).items():
        setattr(time_off, key, value)
    
    db.commit()
    db.refresh(time_off)
    return time_off

@router.delete("/time_off/{time_off_id}", status_code=204, dependencies=[Depends(require_role([Role.admin]))])
def delete_time_off(time_off_id: UUID, db: Session = Depends(get_db)):
    time_off = db.query(DoctorTimeOff).filter(DoctorTimeOff.id == time_off_id).first()
    if not time_off:
        raise HTTPException(status_code=404, detail="Time off not found")
    
    db.delete(time_off)
    db.commit()
    return {"message": "Time off deleted successfully"}