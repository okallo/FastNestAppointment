from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class TimeOffCreate(BaseModel):
    doctor_id: UUID
    start_time: datetime
    end_time: datetime
    reason: str



