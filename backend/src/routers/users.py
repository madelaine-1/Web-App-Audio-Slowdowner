from fastapi import APIRouter, HTTPException, Depends
from ..schemas import users as usersSchema
from ..schemas import auth as authSchema
from sqlalchemy.orm import Session
from ..dependancies import get_db
from ..services import users
from starlette import status
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from ..services import auth
from datetime import timedelta

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "User not found"}},
)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(user: usersSchema.UserCreate, db: Session = Depends(get_db)):
    db_user = users.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered.")
    db_user = users.get_user_by_username(db, username=user.username)
    if db_user: 
        raise HTTPException(status_code=400, detail="Username already exists.")
    return users.create_user(db, user=user)

@router.post("/token", response_model=authSchema.Token)
async def get_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
                           db:Session = Depends(get_db)):
    user = auth.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    token = auth.create_access_token(user.username, user.id, timedelta(hours=6))

    return {'access_token': token, "token_type": "bearer"}

@router.get("/", response_model=list[usersSchema.User])
def get_users(db: Session = Depends(get_db)):
    db_users = users.get_users(db)
    return db_users

@router.delete("/{user_id}", response_model=usersSchema.User)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = users.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found.")
    return users.delete_user(db, db_user)