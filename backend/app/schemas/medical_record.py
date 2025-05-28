from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime

from app.schemas.appointment import AppointmentOut

class MedicalRecordBase(BaseModel):
    appointment_id: UUID
    notes: str

class MedicalRecordCreate(MedicalRecordBase):
    pass

class MedicalRecordOut(BaseModel):
    id: UUID
    notes: str
    created_at: datetime
    appointment: AppointmentOut

    class Config:
        from_attributes = True
