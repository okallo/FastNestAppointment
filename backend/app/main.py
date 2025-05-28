from fastapi import FastAPI
from app.api.api_v1.api import api_router
from app.core.config import settings
from app.db.session import engine
from app.db.base_class import Base


Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(api_router, prefix="/api/v1")

