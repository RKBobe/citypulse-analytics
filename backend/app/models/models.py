from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    dashboards = relationship("Dashboard", back_populates="owner")

class Dashboard(Base):
    __tablename__ = "dashboards"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"))
    is_public = Column(Integer, default=0)
    layout_config = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    owner = relationship("User", back_populates="dashboards")
    widgets = relationship("Widget", back_populates="dashboard", cascade="all, delete-orphan")

class Widget(Base):
    __tablename__ = "widgets"
    
    id = Column(Integer, primary_key=True, index=True)
    dashboard_id = Column(Integer, ForeignKey("dashboards.id"))
    widget_type = Column(String, nullable=False)  # 'chart', 'map', 'stat', 'table'
    title = Column(String, nullable=False)
    config = Column(JSON)  # Chart config, data source, etc.
    position = Column(JSON)  # {x, y, w, h} for grid layout
    data_source = Column(String)  # API endpoint or query
    refresh_interval = Column(Integer)  # in seconds
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    dashboard = relationship("Dashboard", back_populates="widgets")

class CityMetric(Base):
    __tablename__ = "city_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, nullable=False, index=True)
    metric_type = Column(String, nullable=False, index=True)  # population, traffic, air_quality, etc.
    value = Column(Float, nullable=False)
    unit = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    source = Column(String)
    meta_data = Column(JSON)  # Changed from 'metadata' to 'meta_data'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
