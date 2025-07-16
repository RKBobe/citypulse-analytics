from app.db.base import SessionLocal
from app.models.models import User, Dashboard, Widget, CityMetric
from datetime import datetime
import json

db = SessionLocal()

try:
    # Create a test user
    test_user = User(
        email="test@citypulse.com",
        username="testuser",
        hashed_password="hashed_password_here",  # In real app, this would be properly hashed
        is_active=1
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    print(f"✅ Created user: {test_user.username}")

    # Create a test dashboard
    test_dashboard = Dashboard(
        title="City Overview Dashboard",
        description="Main dashboard for city metrics",
        owner_id=test_user.id,
        is_public=1,
        layout_config={"columns": 12, "rowHeight": 50}
    )
    db.add(test_dashboard)
    db.commit()
    db.refresh(test_dashboard)
    print(f"✅ Created dashboard: {test_dashboard.title}")

    # Create some widgets
    widget1 = Widget(
        dashboard_id=test_dashboard.id,
        widget_type="stat",
        title="Population",
        config={"metric": "population", "format": "number"},
        position={"x": 0, "y": 0, "w": 3, "h": 2},
        data_source="/api/metrics/population",
        refresh_interval=3600
    )
    
    widget2 = Widget(
        dashboard_id=test_dashboard.id,
        widget_type="chart",
        title="Air Quality Trend",
        config={"chartType": "line", "metric": "air_quality"},
        position={"x": 3, "y": 0, "w": 6, "h": 4},
        data_source="/api/metrics/air_quality",
        refresh_interval=300
    )
    
    db.add_all([widget1, widget2])
    db.commit()
    print(f"✅ Created {2} widgets")

    # Create some city metrics
    metrics = [
        CityMetric(
            city="San Francisco",
            metric_type="population",
            value=873965,
            unit="people",
            source="Census Bureau"
        ),
        CityMetric(
            city="San Francisco",
            metric_type="air_quality",
            value=45,
            unit="AQI",
            source="EPA",
            meta_data={"quality": "Good"}
        ),
        CityMetric(
            city="San Francisco",
            metric_type="traffic_index",
            value=28.5,
            unit="index",
            source="Traffic Department"
        )
    ]
    
    db.add_all(metrics)
    db.commit()
    print(f"✅ Created {len(metrics)} city metrics")
    
    print("\n🎉 Test data added successfully!")

except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
