from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

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
    return crud.create_user(db=db, user=user)

# returns a list of all users
@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
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
