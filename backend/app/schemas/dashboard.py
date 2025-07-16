from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class WidgetBase(BaseModel):
    widget_type: str
    title: str
    config: Optional[Dict[str, Any]] = {}
    position: Optional[Dict[str, Any]] = {}
    data_source: Optional[str] = None
    refresh_interval: Optional[int] = None

class WidgetResponse(WidgetBase):
    id: int
    dashboard_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class DashboardBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_public: Optional[int] = 0
    layout_config: Optional[Dict[str, Any]] = {}

class DashboardCreate(DashboardBase):
    owner_id: int

class DashboardUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[int] = None
    layout_config: Optional[Dict[str, Any]] = None

class DashboardListResponse(DashboardBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class DashboardResponse(DashboardListResponse):
    widgets: List[WidgetResponse] = []
    
    class Config:
        from_attributes = True
