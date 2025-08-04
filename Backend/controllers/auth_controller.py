from models.user import SignupUser, LoginUser
from utils.jwt_helper import create_token
import bcrypt
from fastapi import HTTPException


async def register_user(user: SignupUser):
    db_user = await SignupUser.find_one({"username": user.username})
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    new_user = SignupUser(
        username=user.username,
        password=hashed,
        gender=user.gender,
        phone=user.phone,
        role=user.role or "user"
    )
    await new_user.insert()
    return {"message": "signed up"}

# async def register_user(user: SignupUser):
#     db_user = await SignupUser.find_one({"username": user.username})
#     if db_user:
#         raise HTTPException(status_code=400, detail="Username already registered")
#     hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
#     new_user = SignupUser(
#         username=user.username,
#         password=hashed,
#         gender=user.gender,
#         phone=user.phone,
#         role=user.role or "user"
#     )
#     await new_user.insert()
#     return {"message": "signed up"}

async def login_user(user: LoginUser):
 
    db_user = await SignupUser.find_one({"username": user.username})
 
    if not db_user:
        raise HTTPException(status_code=401, detail="Wrong username or password")
 
    is_password_correct = bcrypt.checkpw(user.password.encode(), db_user.password.encode())
    if not is_password_correct:
        raise HTTPException(status_code=401, detail="Wrong username or password")
 
    return {"message": "login successful"}


