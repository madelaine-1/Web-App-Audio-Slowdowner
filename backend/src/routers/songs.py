from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session
from ..schemas import songs as songsSchema
from ..schemas import users as usersSchema
from ..dependancies import get_db
from ..services import auth

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

# @router.post("/{file_path}")
# async def upload_song(file: UploadFile, 
#                       current_user: usersSchema.User = Depends[usersSchema.User, auth.get_current_user], 
#                       db: Session = Depends(get_db)):
#     return file
