from fastapi import APIRouter, Depends, UploadFile, status, HTTPException, File, Form
from fastapi.responses import StreamingResponse
from typing import Annotated
from sqlalchemy.orm import Session
from ..schemas import songs as songsSchema
from ..schemas import users as usersSchema
from ..dependancies import get_db
from ..services import auth, songs
from io import BytesIO

MIME_TO_EXTENSION = {
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/aac': 'aac',
    'audio/ogg': 'ogg',
    'audio/vnd.wave': 'wav',
}

router = APIRouter(
    prefix="/songs",
    tags=["songs"],
    dependencies=[Depends(auth.get_current_user)]
)



@router.get("/", response_model=list[songsSchema.Song])
async def get_users_songs(
        current_user: Annotated[usersSchema.User, Depends(auth.get_current_user)],
        db: Session = Depends(get_db)
    ):
    db_songs = songs.get_songs_by_user(db=db, user_id=current_user.id)
    return db_songs



@router.get("/{song_id}")
async def get_song_by_id(
    song_id: int,
    current_user: usersSchema.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    song_file_path = songs.get_song_file_by_id(db=db, song_id=song_id, user=current_user)
    if song_file_path is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )

    with open(song_file_path, 'rb') as f:
        file_contents = f.read()

    return StreamingResponse(BytesIO(file_contents), media_type="audio/mpeg")



@router.post("/", status_code=status.HTTP_201_CREATED)
async def upload_song(
                      current_user: Annotated[usersSchema.User, Depends(auth.get_current_user)], 
                      db: Session = Depends(get_db),
                      song_name: str = Form(...),
                      artist_name: str = Form(...), 
                      file: UploadFile = File(...) 
                      ):
    
    # Check if name and artist are given
    print(file.content_type)

    if song_name is None or artist_name is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Song name or artist not given"
        )
    
    # Check if audio file is supported
    mime_extension = file.content_type
    file_type = None

    if mime_extension in MIME_TO_EXTENSION:
        file_type=MIME_TO_EXTENSION[mime_extension]
    else:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="File type not supported"
        )

    
    song = songsSchema.SongCreate(
        name=song_name, 
        artist=artist_name, 
        fileType=file_type,
        filePath=current_user.username
    )
    
    # check if song already exist
    if song_name in current_user.songs:
        raise HTTPException(
            status_code=status.HTTP_428_PRECONDITION_REQUIRED,
            detail="Song already exists"
        )

    # check if file is valid
    if file is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided"
        )

    file_content = await file.read()

    #check if file content is valid
    if not file_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The file is empty"
        )

    await songs.create_song(db, song=song, file_content=file_content, user=current_user)