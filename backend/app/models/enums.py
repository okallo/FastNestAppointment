from enum import Enum

class TimeOffStatusEnum(str, Enum):
    pending = "Pending"
    approved = "Approved"
    rejected = "Rejected"


class AppointmentStatus(str, Enum):
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"

class Role(str, Enum):
    admin = "admin"
    doctor = "doctor"
    patient = "patient"