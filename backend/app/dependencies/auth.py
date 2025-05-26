from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from app.models.user import Role, User
from app.dependencies.db import get_db
from app.models import user
from app.core.security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role_str = payload.get("role")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        try:
            _ = Role(role_str)
        except ValueError:
            raise HTTPException(status_code=401, detail="Invalid role in token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token decode error")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def require_role(required_roles: list[Role]):
    def role_checker(user: User = Depends(get_current_user)):
        if user.role not in required_roles:
            raise HTTPException(status_code=403, detail="Access denied")
        return user
    return role_checker
