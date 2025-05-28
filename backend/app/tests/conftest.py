import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.base_class import Base
from app.db.session import SessionLocal
from app.dependencies.db import get_db

@pytest.fixture(scope="module")
def test_client():
    def override_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_db
    client = TestClient(app)
    yield client
