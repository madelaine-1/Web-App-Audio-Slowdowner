from sqlalchemy.orm import Session
from ..models import models
from ..schemas import users
from ..schemas import songs
from . import auth

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: users.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        username=user.username, 
        email=user.email, 
        password=hashed_password,
        rootDirectory=user.username,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def delete_user(db: Session, user: users.User):
    db.delete(user)
    db.commit()
    return user

def add_song(song: songs.Song, db: Session, user: users.User):
    user.songs.append(song)
    db.commit()
    return user