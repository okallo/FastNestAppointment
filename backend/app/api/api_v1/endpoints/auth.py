from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app import models, schemas
from app.core.security import ALGORITHM, SECRET_KEY, create_token_pair, get_password_hash, verify_password, create_access_token
from app.dependencies.db import get_db
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer

from app.dependencies.auth import require_role
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
from app.models.enums import Role

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token, refresh_token = create_token_pair({"sub": user.email, "role": user.role.value})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/register", response_model=UserOut, dependencies=[Depends(require_role([Role.admin]))])
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = get_password_hash(user_in.password)
    user = User(email=user_in.email, username=user_in.username, hashed_password=hashed_pw, role=user_in.role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/refresh")
def refresh_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        role = Role(payload.get("role"))
        new_token = create_access_token({"sub": sub, "role": role})
        return {"access_token": new_token}
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid refresh token")