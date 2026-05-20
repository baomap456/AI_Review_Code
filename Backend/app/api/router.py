from fastapi import APIRouter
from app.api.routes import review

api_router = APIRouter() 
api_router.include_router(review.router, prefix="/api/review", tags=["review"])