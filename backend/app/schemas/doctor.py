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
    license_number: str

class TimeOffBase(BaseModel):
    start_time: str
    end_time: str

class TimeOffCreate(TimeOffBase):
    pass

class TimeOffUpdate(TimeOffBase):
    approved: Optional[bool] = None

class TimeOffOut(TimeOffBase):
    id: UUID
    doctor_id: UUID
    approved: bool

    class Config:
        from_attributes = True



class DoctorCreate(DoctorBase):
    pass

class DoctorOut(BaseModel):
    id: UUID
    user_id: UUID
    specialization: str
    user: UserOut
    license_number: str
class DoctorWithTimeOff(DoctorOut):
    time_off: List[TimeOffOut] = []
    class Config:
        from_attributes = True
