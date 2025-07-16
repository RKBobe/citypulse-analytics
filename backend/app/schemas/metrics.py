from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class MetricBase(BaseModel):
    city: str
    metric_type: str
    value: float
    unit: Optional[str] = None
    source: Optional[str] = None
    meta_data: Optional[Dict[str, Any]] = None

class MetricCreate(MetricBase):
    pass

class MetricResponse(MetricBase):
    id: int
    timestamp: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

class MetricAggregate(BaseModel):
    date: str
    value: float
    unit: str
    aggregation_type: str
