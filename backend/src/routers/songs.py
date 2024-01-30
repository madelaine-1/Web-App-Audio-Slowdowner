from fastapi import APIRouter, Depends, UploadFile, status, HTTPException, File, Form
from typing import Annotated
from sqlalchemy.orm import Session
from ..schemas import songs as songsSchema
from ..schemas import users as usersSchema
from ..dependancies import get_db
from ..services import auth, songs

router = APIRouter(
    prefix="/songs",
    tags=["songs"],
    dependencies=[Depends(auth.get_current_user)]
)


@router.get("/", response_model=None)
async def get_users_songs(
    current_user: usersSchema.User,
    db: Session = Depends(get_db)):
    return {"username": current_user.username}

@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_song(
                      current_user: Annotated[usersSchema.User, Depends(auth.get_current_user)], 
                      db: Session = Depends(get_db),
                      song_name: str = Form(...),
                      artist_name: str = Form(...), 
                      file: UploadFile = File(...) 
                      ):
    print(f"File type: ${file.content_type}")

    if song_name is None or artist_name is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Song name or artist not given"
        )
    
    song = songsSchema.SongCreate(
        name=song_name, 
        artist=artist_name, 
        filePath=current_user.username
    )
    
    if song_name in current_user.songs:
        raise HTTPException(
            status_code=status.HTTP_428_PRECONDITION_REQUIRED,
            detail="Song already exists"
        )

    if file is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided"
        )

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The file is empty"
        )

    await songs.create_song(db, song=song, file_content=file_content,file_type=file.content_type.split('/')[1], user=current_user)