
from typing import  Optional
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from app.models.enums import TimeOffStatusEnum
from app.schemas.doctor import DoctorOut





class TimeOffBase(BaseModel):
    doctor_id: UUID
    start_time: datetime
    end_time: datetime
    reason: Optional[str] = None
    status: TimeOffStatusEnum = TimeOffStatusEnum.pending
class TimeOffCreate(BaseModel):
    pass

class TimeOff(BaseModel):
    id: UUID

class TimeOffUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    reason: Optional[str] = None
    status: Optional[TimeOffStatusEnum] = None

class TimeOffOut(TimeOffCreate):
    id: UUID
    reason: str
    status: TimeOffStatusEnum
    start_date: datetime
    end_date: datetime
    doctor: DoctorOut
    




