from pydantic import BaseModel, EmailStr
from uuid import UUID

class PatientCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    insurance_number: str

class PatientOut(BaseModel):
    id: UUID
    user_id: UUID
    insurance_number: str

    class Config:
        from_attributes = True
