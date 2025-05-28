from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

from app.schemas.doctor import DoctorOut

class AvailabilityBase(BaseModel):
    start_time: datetime
    end_time: datetime

class AvailabilityCreate(AvailabilityBase):
    doctor_id: UUID

class AvailabilityOut(AvailabilityBase):
    id: int
    is_booked: bool
    start_time: datetime
    end_time: datetime
    doctor: DoctorOut

    class Config:
        from_attributes = True
