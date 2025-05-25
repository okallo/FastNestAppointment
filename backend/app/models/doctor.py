from sqlalchemy import Column, String, UUID
from app.db.session import Base
import uuid

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)
    specialization = Column(String, nullable=False)
    availability = Column(String, nullable=True)
