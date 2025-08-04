from fastapi import APIRouter, Depends, HTTPException
from controllers.transaction_controller import create_transaction, list_transactions, delete_transaction, update_transaction
from models.transaction import TransactionIn, TransactionOut
from models.user import SignupUser, TokenUser
from utils.jwt_helper import verify_token
from typing import List

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("", response_model=TransactionOut)
async def create_transaction_endpoint(transaction_in: TransactionIn, current_user: dict = Depends(verify_token)):
    db_user = await SignupUser.find_one({"username": current_user["user"]})
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")
    return await create_transaction(transaction_in, db_user)

@router.get("", response_model=List[TransactionOut])
async def list_transactions_endpoint(current_user: dict = Depends(verify_token)):
    db_user = await SignupUser.find_one({"username": current_user["user"]})
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")
    return await list_transactions(db_user)

@router.delete("/{transaction_id}")
async def delete_transaction_endpoint(transaction_id: str, current_user: dict = Depends(verify_token)):
    db_user = await SignupUser.find_one({"username": current_user["user"]})
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")
    result = await delete_transaction(transaction_id, db_user)
    if result is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return result

@router.get("/test")
async def test_transaction():
    return {"message": "Transaction route is working"}

@router.put("/{transaction_id}", response_model=TransactionOut)
async def update_transaction_endpoint(transaction_id: str, transaction_in: TransactionIn, current_user: dict = Depends(verify_token)):
    db_user = await SignupUser.find_one({"username": current_user["user"]})
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")
    return await update_transaction(transaction_id, transaction_in, db_user)