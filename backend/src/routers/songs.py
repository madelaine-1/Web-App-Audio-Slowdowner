from fastapi import APIRouter, Depends
from ..schemas import songs as schema
from sqlalchemy.orm import Session
from ..dependancies import get_db

router = APIRouter(
    prefix="/songs",
    tags=["songs"],
    responses={404: {"description": "Song not found"}},
)

# # get users songs
# @router.get("/", response_model=list[songs.Song])
# async def read_songs(db: Session = Depends(get_db)):


# # gets song by id
# @router.get("/{song_id}")


# # delete a song
# @router.delete("/{song_id}")

# # add a song
# @router.post("/")

# # edit a song
# @router.put("/{song_id}")
