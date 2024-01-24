from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],
)

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

#Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close


# Users
# Creates a user
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db, user=user) 

# # User logs in
# @app.post("/login/", response_model=dict)
# async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
#     user = crud.get_user_by_username(db, form_data.username)
#     if not user:
#         raise HTTPException(status_code=400, detail="Incorrect username or password")
#     hashed_password = form_data.password
#     if not hashed_password == user.password:
#         raise HTTPException(status_code=400, detail="Incorrect username or password")
    
#     return {"access_token": user.username, "token_type": "bearer"}

# returns a list of all users
@app.get("/users/", response_model=list[schemas.User])
async def read_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

# returns the user with a given user id
@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Items
# Creates a song for a given user
@app.post("/items/{user_id}", response_model=schemas.Song)
def upload_song(user_id: int, song: schemas.SongCreate, db: Session = Depends(get_db)):
    db_song = crud.create_song(db, song=song, user_id=user_id)

# Gets the songs of a given user
@app.get("/items/{user_id}", response_model=list[schemas.Song])
def read_users_songs(user_id: int, db: Session = Depends(get_db)):
    songs = crud.get_songs_by_user(db, user_id=user_id)
    return songs
