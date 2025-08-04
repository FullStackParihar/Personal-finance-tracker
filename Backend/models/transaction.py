from beanie import Document
from pydantic import BaseModel
from datetime import date
from typing import Literal

class Transaction(Document):
    user_id: str
    amount: float
    type: Literal["income", "expense"]
    category: str
    date: date
    note: str | None = None

    class Settings:
        name = "transactions"

class TransactionIn(BaseModel):
    amount: float
    type: Literal["income", "expense"]
    category: str
    date: date
    note: str | None = None

 

class TransactionOut(BaseModel):
    id: str
    user_id: str
    amount: float
    type: Literal['income', 'expense'] 
    category: str
    date: date
    note: str
