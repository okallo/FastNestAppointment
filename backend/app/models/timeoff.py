import uuid
from sqlalchemy import Column, DateTime, ForeignKey, String, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base
from app.models.enums import TimeOffStatusEnum
from sqlalchemy.orm import relationship
class DoctorTimeOff(Base):
    __tablename__ = "doctor_time_off"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    reason = Column(String, nullable=False)
    status = Column(SQLEnum(TimeOffStatusEnum, name="time_off_status"), nullable=False, default=TimeOffStatusEnum.pending)

    doctor = relationship("Doctor", back_populates="time_offs")