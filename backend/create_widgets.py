from app.db.base import SessionLocal
from app.models.models import Dashboard, Widget
import json

db = SessionLocal()

try:
    # Get first dashboard
    dashboard = db.query(Dashboard).first()
    print(f"Adding widgets to: {dashboard.title}")
    
    widgets_data = [
        {
            "widget_type": "chart",
            "title": "Population Growth",
            "config": {"chart_type": "line", "refresh_rate": 300},
            "position": {"x": 0, "y": 0, "w": 2, "h": 2}
        },
        {
            "widget_type": "stat",
            "title": "Current Temperature",
            "config": {"unit": "celsius", "refresh_rate": 60},
            "position": {"x": 2, "y": 0, "w": 1, "h": 1}
        },
        {
            "widget_type": "map",
            "title": "Traffic Heatmap",
            "config": {"zoom": 12, "center": {"lat": 40.7128, "lng": -74.0060}},
            "position": {"x": 0, "y": 2, "w": 3, "h": 2}
        }
    ]
    
    for widget_data in widgets_data:
        widget = Widget(
            dashboard_id=dashboard.id,
            widget_type=widget_data["widget_type"],
            title=widget_data["title"],
            config=widget_data["config"],
            position=widget_data["position"]
        )
        db.add(widget)
        print(f"✓ Created widget: {widget.title}")
    
    db.commit()
    print(f"\nTotal widgets created: {len(widgets_data)}")
    
except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
