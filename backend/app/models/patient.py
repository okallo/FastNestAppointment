import uuid
from sqlalchemy import UUID, Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Patient(Base):
    __tablename__ = "patients"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID, ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String, nullable=True)
    insurance_number = Column(String, nullable=True)

    user = relationship("User", back_populates="patient")
    appointments = relationship("Appointment", back_populates="patient")