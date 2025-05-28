from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from enum import Enum
from app.schemas.doctor import DoctorOut
from app.schemas.patient import PatientOut

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
    patient: PatientOut
    doctor: DoctorOut
    start_time: datetime
    end_time: datetime