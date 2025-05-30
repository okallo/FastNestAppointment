from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

from app.schemas.doctor import DoctorOut

class AvailabilityBase(BaseModel):
    doctor_id: UUID
    start_time: datetime
    end_time: datetime

class AvailabilityCreate(AvailabilityBase):
    pass

class AvailabilityOut(AvailabilityBase):
    id: int
    is_booked: bool
    day_of_week: int
    start_time: datetime
    end_time: datetime
    doctor: DoctorOut

    class Config:
        from_attributes = True
