from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI instance
app = FastAPI(
    title="CityPulse Analytics",
    debug=True,
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to CityPulse Analytics",
        "version": "0.1.0",
        "status": "operational"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "backend"
    }

# API info endpoint
@app.get("/api/v1/info")
async def api_info():
    return {
        "name": "CityPulse Analytics",
        "version": "0.1.0",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "metrics": "/api/v1/metrics",
            "dashboards": "/api/v1/dashboards"
        }
    }
