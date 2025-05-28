from sqlalchemy import Column, String, DateTime, Text
from app.db.base_class import Base
from datetime import datetime
from uuid import uuid4

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    actor_email = Column(String, index=True)
    action = Column(String)
    details = Column(Text)
    timestamp = Column(DateTime, default=datetime.now)
