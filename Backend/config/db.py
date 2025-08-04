from motor.motor_asyncio import AsyncIOMotorClient
from models.user import SignupUser
from models.transaction import Transaction
from beanie import init_beanie

async def init_db():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    await init_beanie(database=client.finance_tracker, document_models=[SignupUser, Transaction])