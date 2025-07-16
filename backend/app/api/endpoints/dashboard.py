from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.models import Dashboard, Widget
from app.schemas.dashboard import (
    DashboardCreate, 
    DashboardUpdate, 
    DashboardResponse,
    DashboardListResponse
)

router = APIRouter()

@router.get("/", response_model=List[DashboardListResponse])
def get_dashboards(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all dashboards"""
    dashboards = db.query(Dashboard).offset(skip).limit(limit).all()
    return dashboards

@router.get("/{dashboard_id}", response_model=DashboardResponse)
def get_dashboard(dashboard_id: int, db: Session = Depends(get_db)):
    """Get a specific dashboard by ID"""
    dashboard = db.query(Dashboard).filter(Dashboard.id == dashboard_id).first()
    if not dashboard:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    return dashboard

@router.post("/", response_model=DashboardResponse)
def create_dashboard(
    dashboard: DashboardCreate,
    db: Session = Depends(get_db)
):
    """Create a new dashboard"""
    db_dashboard = Dashboard(**dashboard.dict())
    db.add(db_dashboard)
    db.commit()
    db.refresh(db_dashboard)
    return db_dashboard

@router.put("/{dashboard_id}", response_model=DashboardResponse)
def update_dashboard(
    dashboard_id: int,
    dashboard: DashboardUpdate,
    db: Session = Depends(get_db)
):
    """Update a dashboard"""
    db_dashboard = db.query(Dashboard).filter(Dashboard.id == dashboard_id).first()
    if not db_dashboard:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    
    update_data = dashboard.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_dashboard, field, value)
    
    db.commit()
    db.refresh(db_dashboard)
    return db_dashboard

@router.delete("/{dashboard_id}")
def delete_dashboard(dashboard_id: int, db: Session = Depends(get_db)):
    """Delete a dashboard"""
    db_dashboard = db.query(Dashboard).filter(Dashboard.id == dashboard_id).first()
    if not db_dashboard:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    
    db.delete(db_dashboard)
    db.commit()
    return {"message": "Dashboard deleted successfully"}

@router.get("/{dashboard_id}/widgets")
def get_dashboard_widgets(dashboard_id: int, db: Session = Depends(get_db)):
    """Get all widgets for a dashboard"""
    dashboard = db.query(Dashboard).filter(Dashboard.id == dashboard_id).first()
    if not dashboard:
        raise HTTPException(status_code=404, detail="Dashboard not found")
    
    widgets = db.query(Widget).filter(Widget.dashboard_id == dashboard_id).all()
    return widgets
