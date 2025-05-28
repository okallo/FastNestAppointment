from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from uuid import UUID

class AuditLogCreate(BaseModel):
    actor_email: EmailStr
    action: str
    details: Optional[str] = None

class AuditLogOut(BaseModel):
    id: UUID
    actor_email: EmailStr
    action: str
    details: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True
