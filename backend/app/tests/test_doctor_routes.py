import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app  
from app.db.base_class import Base  
from app.db.session import get_db
from app.core.security import get_password_hash
from app.models.user import User, Role
from app.models.doctor import Doctor
from uuid import uuid4


SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db


client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    admin_user = User(
        email="admin@example.com",
        username="admin",
        hashed_password=get_password_hash("adminpass"),
        role=Role.admin
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    yield
    Base.metadata.drop_all(bind=engine)

def test_create_doctor():
    payload = {
        "email": "doctor1@example.com",
        "username": "doctor1",
        "password": "strongpass",
        "specialization": "cardiology",
        "license_number": "LIC123"
    }

    response = client.post("/doctors/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["specialization"] == "cardiology"
    assert data["user"]["email"] == "doctor1@example.com"

def test_list_doctors():
    response = client.get("/doctors/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_set_doctor_time_off():
    db = next(override_get_db())
    doctor = db.query(Doctor).first()

    payload = {
        "start_time": "2025-06-01T08:00:00",
        "end_time": "2025-06-02T18:00:00"
    }

    
    from app.dependencies.auth import get_current_user
    app.dependency_overrides[get_current_user] = lambda: doctor.user

    response = client.post("/doctors/time_off", json=payload)
    assert response.status_code == 201

def test_get_doctor_time_off():
    db = next(override_get_db())
    doctor = db.query(Doctor).first()
    response = client.get(f"/doctors/{doctor.id}/time_off")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_time_off():
    db = next(override_get_db())
    time_off = db.query(Doctor).first().time_offs[0]

    payload = {
        "approved": True,
        "start_time": time_off.start_time,
        "end_time": time_off.end_time
    }

    response = client.patch(f"/doctors/time_off/{time_off.id}", json=payload)
    assert response.status_code == 200
    assert response.json()["approved"] == True

def test_delete_time_off():
    db = next(override_get_db())
    time_off = db.query(Doctor).first().time_offs[0]

    response = client.delete(f"/doctors/time_off/{time_off.id}")
    assert response.status_code == 204
