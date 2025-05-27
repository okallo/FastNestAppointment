from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class AvailabilityBase(BaseModel):
    start_time: datetime
    end_time: datetime

class AvailabilityCreate(AvailabilityBase):
    doctor_id: UUID

class AvailabilityOut(AvailabilityBase):
    id: int
    doctor_id: UUID
    is_booked: bool

    class Config:
        from_attributes = True
