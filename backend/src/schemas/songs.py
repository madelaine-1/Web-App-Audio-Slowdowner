from pydantic import BaseModel

class SongBase(BaseModel):
    name: str
    artist: str
    fileType: str
    filePath: str

class SongCreate(SongBase):
    pass

class Song(SongBase):
    id: int
    user_id: int

    class Config:
        from_attribute = True