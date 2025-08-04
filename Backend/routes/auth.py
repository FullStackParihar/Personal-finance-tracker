from fastapi import APIRouter, HTTPException
from controllers.auth_controller import register_user, login_user
from models.user import LoginUser, SignupUser
from utils.jwt_helper import create_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(user: SignupUser):
    return await register_user(user)

@router.post("/login")
async def login(user: LoginUser):
    response = await login_user(user)
    db_user = await SignupUser.find_one({"username": user.username})
    token = create_token(user.username, db_user.role if db_user else "user")
    response["token"] = token
    return response