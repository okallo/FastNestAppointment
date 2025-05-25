from pydantic import BaseModel, EmailStr
from uuid import UUID

class DoctorBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    specialization: str
    availability: str | None = None

class DoctorCreate(DoctorBase):
    pass

class DoctorOut(DoctorBase):
    id: UUID
