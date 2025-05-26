from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MedicalRecordBase(BaseModel):
    patient_id: str
    appointment_id: Optional[str] = None
    notes: str

class MedicalRecordCreate(MedicalRecordBase):
    pass

class MedicalRecordOut(MedicalRecordBase):
    id: str
    doctor_id: str
    created_at: datetime

    class Config:
        orm_mode = True
