from sqlalchemy.orm import Session
from ..models.models import models
from ..schemas.songs import schemas

def get_songs_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 50):
    return db.query(models.Song).offset(skip).limit(limit).filter(models.Song.user_id == user_id).all()

def create_song(db: Session, song: schemas.SongCreate, user_id: int):
    new_song = models.Song(**song.model_dump(), user_id=user_id)
    db.add(new_song)
    db.commit()
    db.refresh(new_song)
    return new_song