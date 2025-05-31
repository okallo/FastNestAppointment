from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

from app.schemas.doctor import DoctorOut

class AvailabilityBase(BaseModel):
    doctor_id: UUID
    start_time: datetime
    end_time: datetime
    day_of_week: int


class AvailabilityCreate(AvailabilityBase):
    pass

class AvailabilityOut(AvailabilityBase):
    id: int
    doctor: DoctorOut
    is_booked: bool

    class Config:
        from_attributes = True
