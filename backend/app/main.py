from fastapi import FastAPI
from app.api.api_v1.api import api_router
from app.core.config import settings
from app.db.session import engine
from app.db.base_class import Base
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

origins = [
    "http://localhost:3000",     
    "https://my-front-end.com",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      
    allow_credentials=True,    
    allow_methods=["*"],        
    allow_headers=["*"],       
)
app.include_router(api_router, prefix="/api/v1")

