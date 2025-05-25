from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from enum import Enum

class AppointmentStatus(str, Enum):
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"

class AppointmentBase(BaseModel):
    patient_id: UUID
    doctor_id: UUID
    start_time: datetime
    end_time: datetime

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentOut(AppointmentBase):
    id: UUID
    status: AppointmentStatus
