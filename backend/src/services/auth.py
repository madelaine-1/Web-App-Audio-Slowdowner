from datetime import timedelta, datetime
from typing import Annotated
from passlib.context import CryptContext
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from ..dependancies import get_db
from sqlalchemy.orm import Session
from ..schemas import auth
from ..models import models

SECRET_KEY = 'ce8c72eaa2e9e208310d9b30d861f781f8bd7e75a906485823c9117ac27c31c8'
ALGORYTHM = "HS256"

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

db_dependency = Annotated[Session, Depends(get_db)]

def hash_password(password: str):
    return bcrypt_context.hash(password)

def authenticate_user(username: str, password: str, db: Session):
    user = db.query(models.User).filter(models.User.username == username)
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    encode = {"sub": username, "id": user_id}
    expires = datetime.utcnow() + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorythm=ALGORYTHM)


