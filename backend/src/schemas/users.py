from pydantic import BaseModel
from .songs import Song

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    rootDirectory: str
    isActive: bool
    songs: list[Song] = []

    class Config:
        from_attributes = True