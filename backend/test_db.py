from app.db.base import SessionLocal
from app.models.models import User, Dashboard, Widget, CityMetric

# Create a session
db = SessionLocal()

try:
    # Count records in each table
    users_count = db.query(User).count()
    dashboards_count = db.query(Dashboard).count()
    widgets_count = db.query(Widget).count()
    metrics_count = db.query(CityMetric).count()
    
    print("Database Table Status:")
    print(f"✅ Users table: {users_count} records")
    print(f"✅ Dashboards table: {dashboards_count} records")
    print(f"✅ Widgets table: {widgets_count} records")
    print(f"✅ City Metrics table: {metrics_count} records")
    
finally:
    db.close()
