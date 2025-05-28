from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from typing import List

from app.schemas.user import UserOut
class DoctorBase(BaseModel):
    email: EmailStr
    username: str
    password: str
    specialization: str

class DoctorCreate(DoctorBase):
    pass

class DoctorOut(BaseModel):
    id: UUID
    user_id: UUID
    specialization: str
    user: UserOut

    class Config:
        from_attributes = True
