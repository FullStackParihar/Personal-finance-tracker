from motor.motor_asyncio import AsyncIOMotorClient
from models.user import SignupUser
from models.transaction import Transaction
from beanie import init_beanie

async def init_db():
    client = AsyncIOMotorClient("mongodb+srv://vishnuparihar239925:1234@cluster0.oloj4sd.mongodb.net/")
    await init_beanie(database=client.finance_tracker, document_models=[SignupUser, Transaction])