from app.db.base import SessionLocal
from app.models.models import CityMetric
from datetime import datetime, timedelta
import random
import json

db = SessionLocal()

try:
    # Create various types of metrics
    metric_types = [
        ("temperature", "celsius", lambda: round(random.uniform(15, 30), 1)),
        ("air_quality", "AQI", lambda: random.randint(20, 150)),
        ("traffic_flow", "vehicles/hour", lambda: random.randint(100, 5000)),
        ("crime_incidents", "count", lambda: random.randint(0, 50)),
        ("public_transport_usage", "passengers", lambda: random.randint(1000, 50000)),
        ("energy_consumption", "MWh", lambda: round(random.uniform(100, 500), 2)),
        ("water_usage", "gallons", lambda: random.randint(10000, 100000)),
        ("waste_collection", "tons", lambda: round(random.uniform(50, 200), 1)),
        ("population", "people", lambda: random.randint(800000, 900000))
    ]
    
    cities = ["San Francisco", "New York", "Los Angeles", "Chicago", "Seattle"]
    
    # Generate metrics for the last 30 days
    start_date = datetime.now() - timedelta(days=30)
    
    for day in range(30):
        current_date = start_date + timedelta(days=day)
        
        for city in cities:
            for metric_type, unit, value_generator in metric_types:
                metric = CityMetric(
                    city=city,
                    metric_type=metric_type,
                    value=value_generator(),
                    unit=unit,
                    timestamp=current_date,
                    source="City Sensors Network",
                    meta_data={
                        "area": "Downtown" if random.random() > 0.5 else "Suburbs",
                        "reliability": round(random.uniform(0.8, 1.0), 2),
                        "sensor_id": f"SENSOR-{random.randint(1000, 9999)}"
                    }
                )
                db.add(metric)
    
    db.commit()
    
    # Count total metrics
    metrics_count = db.query(CityMetric).count()
    print(f"Successfully created metrics!")
    print(f"Total metrics in database: {metrics_count}")
    
    # Show some sample metrics
    sample_metrics = db.query(CityMetric).limit(5).all()
    print("\nSample metrics:")
    for metric in sample_metrics:
        print(f"- {metric.city}: {metric.metric_type} = {metric.value} {metric.unit}")
    
except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
