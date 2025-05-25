from pydantic import BaseModel, EmailStr
from uuid import UUID

class PatientCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    insurance_number: str

class PatientOut(PatientCreate):
    id: UUID
