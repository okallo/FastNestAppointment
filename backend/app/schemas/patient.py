from pydantic import BaseModel, EmailStr
from uuid import UUID

from app.schemas.user import UserOut

class PatientCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    insurance_number: str

class PatientOut(BaseModel):
    id: UUID
    insurance_number: str
    user: UserOut


    class Config:
        from_attributes = True
