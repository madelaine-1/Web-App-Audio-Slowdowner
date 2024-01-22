from sqlalchemy.orm import Session
from . import models, schemas

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = user.password     # make sure to implement password security later
    new_user = models.User(username=user.username, email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def get_songs_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 50):
    return db.query(models.Song).offset(skip).limit(limit).filter(models.Song.user_id == user_id).all()

def create_song(db: Session, song: schemas.ItemCreate, user_id: int):
    new_song = models.Song(**song.model_dump(), user_id=user_id)
    db.add(new_song)
    db.commit()
    db.refresh(new_song)
    return new_song
