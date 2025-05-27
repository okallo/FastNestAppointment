from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from typing import List
from .availability import AvailabilityOut
class DoctorBase(BaseModel):
    email: EmailStr
    username: str
    password: str
    specialization: str
    availability: Optional[str] = None

class DoctorCreate(DoctorBase):
    pass

class DoctorOut(BaseModel):
    id: UUID
    user_id: UUID
    specialization: str
    availability: str | None = None
    availabilities: List[AvailabilityOut] = []

    class Config:
        from_attributes = True
