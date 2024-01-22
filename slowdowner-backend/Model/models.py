from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    username = Column(String, index=True)
    password = Column(String, index=True)
    rootDirectory = Column(String, index=True)
    isActive = Column(Boolean, index=True, default=True)

    songs = relationship("Song", back_populates="owner")

class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    artist = Column(String, index=True)
    filePath = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="songs")
