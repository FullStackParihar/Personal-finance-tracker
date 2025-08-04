from typing import Optional
from pydantic import BaseModel
from beanie import Document

class BaseUser(BaseModel):
    username: str
    password: str

class LoginUser(BaseUser):
    pass

class TokenUser(BaseModel):
    username: str
    role: str

class SignupUser(Document, BaseUser):
    gender: str
    phone: str
    role: Optional[str] = "user"

    class Settings:
        name = "users"

    def __str__(self):
        return f"{self.username} ({self.role})"






# from pydantic import BaseModel, Field
# from beanie import Document
# from typing import Optional
# from bson import ObjectId

# class LoginUser(BaseModel):
#     username: str
#     password: str

# class TokenUser(BaseModel):
#     username: str
#     role: str

# class SignupUser(Document):
#     username: str
#     password: str
#     gender: str
#     phone: str
#     role: Optional[str] = "user"

#     class Settings:
#         name = "users"

#     def __str__(self):
#         return self.username