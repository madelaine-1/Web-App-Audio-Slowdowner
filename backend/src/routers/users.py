from fastapi import APIRouter, HTTPException, Depends, Body
from ..schemas import users as usersSchema
from ..schemas import auth as authSchema
from sqlalchemy.orm import Session
from ..dependancies import get_db
from ..services import users as user_services
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
    db_user_email = user_services.get_user_by_email(db, email=user.email)
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email already registered.")
    db_user_username = user_services.get_user_by_username(db, username=user.username)
    if db_user_username:
        raise HTTPException(status_code=400, detail="Username already exists.")
    user_services.create_user(db, user=user)

@router.post("/token", response_model=authSchema.Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
                           db: Session = Depends(get_db)) -> authSchema.Token:
    user = auth.authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password", 
            headers={'WWW-Authenticate': 'Bearer'}
        )
    access_token_expires = timedelta(auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    return authSchema.Token(access_token=access_token, token_type="bearer")

@router.post("/validate-token", status_code=status.HTTP_202_ACCEPTED)
async def validate_token(token: str = Body(...)):
    isValid = False
    user = auth.get_current_user(token=token, db=Session)
    if user:
        isValid = True
    return {'isValid': isValid}

@router.get("/", response_model=list[usersSchema.User])
def get_users(db: Session = Depends(get_db)) -> list[usersSchema.User]:
    db_users = user_services.get_users(db)
    return db_users

@router.delete("/{user_id}", response_model=usersSchema.User)
def delete_user(user_id: int, db: Session = Depends(get_db)) -> usersSchema.User:
    db_user = user_services.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user_services.delete_user(db, db_user)

@router.get("/current", response_model=str)
def get_current_user(current_user: Annotated[usersSchema.User, Depends(auth.get_current_user)]):
    return current_user.username

