from app.db.base import SessionLocal
from app.models.models import User, Dashboard
import json

db = SessionLocal()

try:
    # Get first user
    user = db.query(User).first()
    if not user:
        print("No users found! Please create a user first.")
    else:
        print(f"Using user: {user.username} (ID: {user.id})")
        
        # Create multiple dashboards
        dashboards_data = [
            {
                "title": "City Overview Dashboard",
                "description": "Main dashboard showing city metrics overview",
                "is_public": 1,
                "layout_config": {"columns": 3, "rows": 2}
            },
            {
                "title": "Traffic Analytics",
                "description": "Real-time traffic monitoring and analysis",
                "is_public": 1,
                "layout_config": {"columns": 2, "rows": 3}
            },
            {
                "title": "Environmental Metrics",
                "description": "Air quality, weather, and environmental data",
                "is_public": 0,
                "layout_config": {"columns": 4, "rows": 2}
            }
        ]
        
        for dash_data in dashboards_data:
            dashboard = Dashboard(
                title=dash_data["title"],
                description=dash_data["description"],
                owner_id=user.id,
                is_public=dash_data["is_public"],
                layout_config=dash_data["layout_config"]
            )
            db.add(dashboard)
            print(f"✓ Created dashboard: {dashboard.title}")
        
        db.commit()
        
        # List all dashboards
        all_dashboards = db.query(Dashboard).all()
        print(f"\nTotal dashboards: {len(all_dashboards)}")
        for d in all_dashboards:
            print(f"  - {d.title} (ID: {d.id}, Public: {'Yes' if d.is_public else 'No'})")
            
except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
