from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import dashboard

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    dashboard.router,
    prefix=f"{settings.API_V1_STR}/dashboards",
    tags=["dashboards"]
)

@app.get("/")
def root():
    return {
        "message": "Welcome to CityPulse Analytics API",
        "version": settings.VERSION,
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Create tables on startup (for development)
@app.on_event("startup")
async def startup_event():
    # Import here to avoid circular imports
    from app.db.base import engine
    from app.models.models import Base
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    print("Database tables ready!")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)
