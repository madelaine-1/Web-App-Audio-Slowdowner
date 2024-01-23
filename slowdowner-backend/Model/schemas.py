from pydantic import BaseModel

class SongBase(BaseModel):
    name: str
    artist: str
    filePath: str

class SongCreate(SongBase):
    pass

class Song(SongBase):
    id: int
    user_id: int

    class Config:
        from_attribute = True

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