from enum import Enum

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Song(BaseModel):
    title: str
    artist: str
    filePath: str

songs = {
    0: Song(title="All the Things You Are", artist="Ari Hoenig", filePath="/path1"),
    1: Song(title="Blues in the Closet", artist="Tigran Hamasyan", filePath="/path2"),
    2: Song(title="Sir Third", artist="Gerald Clayton", filePath="/path3")
}

@app.get("/")
def index() -> "dict[str, dict[int, Song]]":
    return {"songs": songs}

@app.get("/songs/{song_id}")
def query_song_by_id(song_id: int) -> Song:
    if song_id not in songs:
        raise HTTPException(
            status_code=404, detail=f"Song with id{song_id} does not exist."
        )
    return songs[song_id]

# @app.get("/songs/")
# def query_song_by_parameters(title: str | None = None, artist: str | None = None) -> "dict[Song]":
#     return 
    