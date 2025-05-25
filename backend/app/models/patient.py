from sqlalchemy import Column, String, DateTime, UUID
from app.db.session import Base
import uuid

class Patient(Base):
    __tablename__ = "patients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String)
    insurance_number = Column(String)
