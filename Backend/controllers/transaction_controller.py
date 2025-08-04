from models.transaction import Transaction, TransactionIn, TransactionOut
from models.user import SignupUser
from fastapi import HTTPException
from typing import List
from bson import ObjectId


async def create_transaction(transaction_in: TransactionIn, current_user: SignupUser):
    transaction = Transaction(user_id=str(
        current_user.id), **transaction_in.model_dump())
    await transaction.insert()
    return TransactionOut(
        id=str(transaction.id),
        user_id=str(current_user.id),  
        **transaction_in.model_dump()
    )


async def list_transactions(current_user: SignupUser):
    transactions = await Transaction.find(Transaction.user_id == str(current_user.id)).to_list()
    result = []
    for t in transactions:
        data = t.model_dump()
        data.pop("id", None)
        result.append(TransactionOut(id=str(t.id), **data))
    return result


async def delete_transaction(transaction_id: str, current_user: SignupUser):
    transaction = await Transaction.find_one(
        Transaction.id == ObjectId(transaction_id),
        Transaction.user_id == str(current_user.id)
    )
    if not transaction:
        return {"detail": "Transaction not found"}
    await transaction.delete()
    return {"message": "Transaction deleted"}


async def update_transaction(transaction_id: str, transaction_in: TransactionIn, current_user: SignupUser):
    transaction = await Transaction.find_one(
        Transaction.id == ObjectId(transaction_id),
        Transaction.user_id == str(current_user.id)
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    for key, value in transaction_in.model_dump().items():
        setattr(transaction, key, value)
    
    await transaction.save()
    return TransactionOut(
        id=str(transaction.id), 
        user_id=str(current_user.id),  
        **transaction_in.model_dump()
    )
    return {"message": "Transaction updated successfully"}