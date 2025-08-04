# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from beanie import init_beanie
# from motor.motor_asyncio import AsyncIOMotorClient
# from routes.auth import router as auth_router
# from routes.transaction import router as transaction_router
# from config.db import init_db
# from contextlib import asynccontextmanager

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     await init_db()
#     yield
#     app.state.db_client.close()

# app = FastAPI(title="Personal Finance Tracker API", lifespan=lifespan)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# async def root():
#     return {"message": "API is running"}

# app.include_router(auth_router)
# app.include_router(transaction_router)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.db import init_db
from routes.auth import router as auth_router
from routes.transaction import router as transaction_router
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title="Finance Tracker API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return {"message": "API is running"}

app.include_router(auth_router)
app.include_router(transaction_router)
