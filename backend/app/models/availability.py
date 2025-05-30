from sqlalchemy import UUID, Boolean, Column, DateTime, ForeignKey, Integer
from app.db.base_class import Base
from sqlalchemy.orm import relationship


class Availability(Base):
    __tablename__ = "availability"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("doctors.id"))
    day_of_week: int = Column(Integer, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_booked = Column(Boolean, default=False)

    doctor = relationship("Doctor", back_populates="availability")
