from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import UUID, and_, or_
from datetime import datetime
from app.db.session import SessionLocal
from app.models.appointment import Appointment, AppointmentStatus
from app.schemas.appointment import AppointmentCreate, AppointmentOut

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=AppointmentOut)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    # Check for doctor schedule conflicts
    conflict = db.query(Appointment).filter(
        Appointment.doctor_id == payload.doctor_id,
        Appointment.status == AppointmentStatus.scheduled,
        or_(
            and_(Appointment.start_time <= payload.start_time, Appointment.end_time > payload.start_time),
            and_(Appointment.start_time < payload.end_time, Appointment.end_time >= payload.end_time),
            and_(Appointment.start_time >= payload.start_time, Appointment.end_time <= payload.end_time)
        )
    ).first()

    if conflict:
        raise HTTPException(status_code=400, detail="Doctor is already booked during this time slot.")

    appointment = Appointment(**payload.dict())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

@router.get("/", response_model=list[AppointmentOut])
def list_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).all()

@router.patch("/{appointment_id}/status", response_model=AppointmentOut)
def update_appointment_status(
    appointment_id: UUID,
    status: AppointmentStatus,
    db: Session = Depends(get_db)
):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appointment.status = status
    db.commit()
    db.refresh(appointment)
    return appointment