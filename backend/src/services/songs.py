from sqlalchemy.orm import Session
from ..models import models
from ..schemas import songs as songsSchema
from ..schemas import users as usersSchema
from ..services import users
import os

rootDirectory = "/Users/victormadelaine/Desktop/Coding/Web-App-Audio-Slowdowner/backend/root"

def get_songs_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 50):
    return db.query(models.Song).offset(skip).limit(limit).filter(models.Song.user_id == user_id).all()

def get_song_by_name(db: Session, song: str, user: usersSchema.User):
    return db.query(models.Song).filter(models.Song.name == song, models.Song.user_id == user.id).first()

async def create_song(db: Session, song: songsSchema.SongCreate, file_content: bytes, file_type: str, user: usersSchema.User):
    try:
        # create file
        song_directory = f"{rootDirectory}/{user.username}/{song.name}.{file_type}"
        os.makedirs(os.path.dirname(song_directory), exist_ok=True)
        with open(song_directory, "wb") as file:
            file.write(file_content)
    except IOError as e:
        print(f"Failed to write file: {e}")
        raise 
    # create database instance
    new_song = models.Song(**song.model_dump(), user_id=user.id)
    db.add(new_song)
    db.commit()
    db.refresh(new_song)
    # add song to user
    db_song = get_song_by_name(db=db, song=song.name, user=user)
    users.add_song(song=db_song, db=db, user=user)

    return new_song