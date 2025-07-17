# backend/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
import random

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./citypulse.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    dashboards = relationship("Dashboard", back_populates="user")

class Dashboard(Base):
    __tablename__ = "dashboards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="dashboards")
    widgets = relationship("Widget", back_populates="dashboard", cascade="all, delete-orphan")

class Widget(Base):
    __tablename__ = "widgets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    widget_type = Column(String)  # line_chart, bar_chart, metric_card, etc.
    dashboard_id = Column(Integer, ForeignKey("dashboards.id"))
    position = Column(Integer, default=0)
    config = Column(JSON)  # Store widget-specific configuration
    created_at = Column(DateTime, default=datetime.utcnow)

    dashboard = relationship("Dashboard", back_populates="widgets")

class CityMetric(Base):
    __tablename__ = "city_metrics"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, index=True)
    metric_type = Column(String, index=True)  # temperature, air_quality, traffic_flow, etc.
    value = Column(Float)
    unit = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    meta_data = Column(JSON, nullable=True)  # Changed from 'metadata' to 'meta_data'

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Models
class UserBase(BaseModel):
    username: str
    email: str
    full_name: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardBase(BaseModel):
    name: str
    description: Optional[str] = None

class DashboardCreate(DashboardBase):
    user_id: Optional[int] = 1  # Default to user 1 for demo

class DashboardUpdate(DashboardBase):
    pass

class DashboardResponse(DashboardBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    widgets: List['WidgetResponse'] = []

    class Config:
        from_attributes = True

class WidgetBase(BaseModel):
    title: str
    widget_type: str
    position: Optional[int] = 0
    config: Optional[dict] = {}

class WidgetCreate(WidgetBase):
    dashboard_id: int

class WidgetUpdate(WidgetBase):
    title: Optional[str] = None
    widget_type: Optional[str] = None
    position: Optional[int] = None
    config: Optional[dict] = None

class WidgetResponse(WidgetBase):
    id: int
    dashboard_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MetricBase(BaseModel):
    city: str
    metric_type: str
    value: float
    unit: str
    meta_data: Optional[dict] = None  # Changed from 'metadata' to 'meta_data'

class MetricCreate(MetricBase):
    pass

class MetricResponse(MetricBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

# Update forward references
DashboardResponse.model_rebuild()

# FastAPI app
app = FastAPI(title="CityPulse Analytics API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to CityPulse Analytics API"}

# User endpoints
@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users", response_model=List[UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

# Dashboard endpoints
@app.post("/dashboards", response_model=DashboardResponse)
def create_dashboard(dashboard: DashboardCreate, db: Session = Depends(get_db)):
    db_dashboard = Dashboard(**dashboard.dict())
    db.add(db_dashboard)
    db.commit()
    db.refresh(db)
