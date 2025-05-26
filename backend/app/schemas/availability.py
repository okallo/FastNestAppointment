from pydantic import BaseModel
from datetime import datetime
class AvailabilityCreate(BaseModel):
    start_time: datetime
    end_time: datetime

class AvailabilityResponse(BaseModel):
    id: int
    start_time: datetime
    end_time: datetime
    is_booked: bool

    class Config:
        orm_mode = True
