from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import models
from .database import engine
from .routers import users

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],
)

app.include_router(users.router)