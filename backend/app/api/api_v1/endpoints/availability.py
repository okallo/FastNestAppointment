
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from requests import Session
from app.dependencies.db import get_db
from app.models.appointment import Appointment, AppointmentStatus
from app.models.timeoff import DoctorTimeOff

router = APIRouter()

@router.get("/doctors/{doctor_id}/available_slots", response_model=list[str])
def get_available_slots(doctor_id: UUID, date: str, db: Session = Depends(get_db)):
    from datetime import datetime, timedelta

    try:
        day_start = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    day_end = day_start + timedelta(days=1)

    # Fetch existing booked appointments
    appointments = db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.status == AppointmentStatus.scheduled,
        Appointment.start_time >= day_start,
        Appointment.end_time <= day_end
    ).all()

    booked_slots = {(a.start_time, a.end_time) for a in appointments}

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
