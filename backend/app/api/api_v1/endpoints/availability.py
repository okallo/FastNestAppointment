
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from requests import Session
from app.dependencies.db import get_db
from app.models.appointment import Appointment, AppointmentStatus
from app.models.timeoff import DoctorTimeOff
from app.dependencies.auth import get_current_user
from app.models.availability import Availability
from app.models.doctor import Doctor
from app.models.user import User
from app.schemas.availability import AvailabilityCreate, AvailabilityOut

router = APIRouter()

@router.get("/doctors/{doctor_id}", response_model=list[str])
def get_available_slots(doctor_id: UUID, date: str, db: Session = Depends(get_db)):
    from datetime import datetime, timedelta

    try:
        day_start = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    day_end = day_start + timedelta(days=1)

    availability = db.query(Availability).filter(
        Availability.doctor_id == doctor_id,
        Availability.start_time >= day_start,
        Availability.end_time <= day_end,
        Availability.is_booked == False
    ).all()

    booked_slots = {(a.start_time, a.end_time) for a in availability}

    # Fetch doctor time offs
    time_offs = db.query(DoctorTimeOff).filter(
        DoctorTimeOff.doctor_id == doctor_id,
        DoctorTimeOff.start_time < day_end,
        DoctorTimeOff.end_time > day_start
    ).all()

    def is_within_timeoff(slot_start, slot_end):
        for off in time_offs:
            if not (slot_end <= off.start_time or slot_start >= off.end_time):
                return True
        return False

    # Generate available 20-minute slots from 8 AM to 5 PM
    slots = []
    current = day_start.replace(hour=8, minute=0)
    end = day_start.replace(hour=17, minute=0)

    while current + timedelta(minutes=20) <= end:
        slot = (current, current + timedelta(minutes=20))
        if slot not in booked_slots and not is_within_timeoff(*slot):
            slots.append(f"{slot[0].isoformat()} to {slot[1].isoformat()}")
        current += timedelta(minutes=20)

    return slots
@router.post("/", response_model=AvailabilityOut)
def create_availability(
    payload: AvailabilityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")
    
    availability = Availability(**payload.dict(), doctor_id=doctor.id)
    db.add(availability)
    db.commit()
    db.refresh(availability)
    return availability