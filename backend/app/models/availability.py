from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer

from app.db.session import Base
from sqlalchemy.orm import relationship


class Availability(Base):
    __tablename__ = "availability"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    is_booked = Column(Boolean, default=False)

    doctor = relationship("Doctor", back_populates="availabilities")
