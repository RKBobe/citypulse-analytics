from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.api import deps
from app.models.models import CityMetric
from app.schemas.metrics import MetricResponse, MetricCreate, MetricAggregate

router = APIRouter()

@router.get("/", response_model=List[MetricResponse])
def get_metrics(
    db: Session = Depends(deps.get_db),
    city: Optional[str] = Query(None, description="Filter by city name"),
    metric_type: Optional[str] = Query(None, description="Filter by metric type"),
    days: int = Query(7, description="Number of days to retrieve"),
    skip: int = 0,
    limit: int = 100
):
    """Get city metrics with optional filters"""
    query = db.query(CityMetric)
    
    # Apply filters
    if city:
        query = query.filter(CityMetric.city == city)
    if metric_type:
        query = query.filter(CityMetric.metric_type == metric_type)
    
    # Filter by date range
    start_date = datetime.now() - timedelta(days=days)
    query = query.filter(CityMetric.timestamp >= start_date)
    
    # Order by timestamp descending and apply pagination
    metrics = query.order_by(CityMetric.timestamp.desc()).offset(skip).limit(limit).all()
    
    return metrics

@router.get("/cities", response_model=List[str])
def get_cities(db: Session = Depends(deps.get_db)):
    """Get list of all cities with metrics"""
    cities = db.query(CityMetric.city).distinct().all()
    return [city[0] for city in cities]

@router.get("/types", response_model=List[str])
def get_metric_types(db: Session = Depends(deps.get_db)):
    """Get list of all metric types"""
    types = db.query(CityMetric.metric_type).distinct().all()
    return [metric_type[0] for metric_type in types]

@router.get("/aggregate", response_model=List[MetricAggregate])
def get_aggregated_metrics(
    db: Session = Depends(deps.get_db),
    city: str = Query(..., description="City name"),
    metric_type: str = Query(..., description="Metric type"),
    days: int = Query(7, description="Number of days to aggregate"),
    aggregation: str = Query("avg", description="Aggregation type: avg, min, max, sum")
):
    """Get aggregated metrics for a specific city and metric type"""
    start_date = datetime.now() - timedelta(days=days)
    
    # Select the appropriate aggregation function
    agg_functions = {
        "avg": func.avg,
        "min": func.min,
        "max": func.max,
        "sum": func.sum
    }
    
    if aggregation not in agg_functions:
        raise HTTPException(status_code=400, detail="Invalid aggregation type")
    
    agg_func = agg_functions[aggregation]
    
    # Query with aggregation
    results = db.query(
        func.date(CityMetric.timestamp).label("date"),
        agg_func(CityMetric.value).label("value"),
        CityMetric.unit
    ).filter(
        CityMetric.city == city,
        CityMetric.metric_type == metric_type,
        CityMetric.timestamp >= start_date
    ).group_by(
        func.date(CityMetric.timestamp),
        CityMetric.unit
    ).order_by("date").all()
    
    return [
        {
            "date": result.date,
            "value": result.value,
            "unit": result.unit,
            "aggregation_type": aggregation
        }
        for result in results
    ]

@router.get("/latest", response_model=List[MetricResponse])
def get_latest_metrics(
    db: Session = Depends(deps.get_db),
    city: Optional[str] = Query(None, description="Filter by city name")
):
    """Get the latest metric for each type in a city"""
    subquery = db.query(
        CityMetric.city,
        CityMetric.metric_type,
        func.max(CityMetric.timestamp).label("max_timestamp")
    )
    
    if city:
        subquery = subquery.filter(CityMetric.city == city)
    
    subquery = subquery.group_by(
        CityMetric.city,
        CityMetric.metric_type
    ).subquery()
    
    latest_metrics = db.query(CityMetric).join(
        subquery,
        (CityMetric.city == subquery.c.city) &
        (CityMetric.metric_type == subquery.c.metric_type) &
        (CityMetric.timestamp == subquery.c.max_timestamp)
    ).all()
    
    return latest_metrics

@router.post("/", response_model=MetricResponse)
def create_metric(
    metric: MetricCreate,
    db: Session = Depends(deps.get_db)
):
    """Create a new city metric"""
    db_metric = CityMetric(**metric.dict())
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric
