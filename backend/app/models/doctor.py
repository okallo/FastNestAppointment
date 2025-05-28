import uuid
from sqlalchemy import UUID, Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID, ForeignKey("users.id"), unique=True, nullable=False)
    license_number = Column(String, nullable=False)
    specialization = Column(String, nullable=False)

    user = relationship("User", back_populates="doctor")
    availability = relationship("Availability", back_populates="doctor")
    appointments = relationship("Appointment", back_populates="doctor")
    time_offs = relationship("DoctorTimeOff", back_populates="doctor", cascade="all, delete-orphan")