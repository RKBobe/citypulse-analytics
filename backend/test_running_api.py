import requests
import json

BASE_URL = "http://localhost:8001"

print("🚀 Testing CityPulse API\n" + "="*50)

# Test root
response = requests.get(f"{BASE_URL}/")
print(f"✅ Root endpoint: {response.json()}")

# Test health
response = requests.get(f"{BASE_URL}/health")
print(f"✅ Health check: {response.json()}")

# Get dashboards
response = requests.get(f"{BASE_URL}/api/v1/dashboards/")
dashboards = response.json()
print(f"\n📊 Dashboards ({len(dashboards)} found):")
for dash in dashboards:
    print(f"  - ID: {dash['id']}, Title: {dash['title']}")

# Get dashboard details
if dashboards:
    dashboard_id = dashboards[0]['id']
    response = requests.get(f"{BASE_URL}/api/v1/dashboards/{dashboard_id}")
    dashboard = response.json()
    print(f"\n📋 Dashboard Details:")
    print(f"  - Title: {dashboard['title']}")
    print(f"  - Description: {dashboard['description']}")
    print(f"  - Widgets: {len(dashboard.get('widgets', []))}")
    
    # Get widgets
    response = requests.get(f"{BASE_URL}/api/v1/dashboards/{dashboard_id}/widgets")
    widgets = response.json()
    print(f"\n🔧 Widgets:")
    for widget in widgets:
        print(f"  - {widget['title']} ({widget['widget_type']})")

# Test metrics endpoints (if they exist)
try:
    # Get cities
    response = requests.get(f"{BASE_URL}/api/v1/metrics/cities")
    if response.status_code == 200:
        cities = response.json()
        print(f"\n🏙️  Cities with metrics: {', '.join(cities)}")
    
    # Get metric types
    response = requests.get(f"{BASE_URL}/api/v1/metrics/types")
    if response.status_code == 200:
        types = response.json()
        print(f"📈 Metric types: {', '.join(types)}")
    
    # Get latest metrics for a city
    if cities:
        response = requests.get(f"{BASE_URL}/api/v1/metrics/{cities[0]}/latest")
        if response.status_code == 200:
            latest = response.json()
            print(f"\n📊 Latest metrics for {cities[0]}:")
            for metric in latest:
                print(f"  - {metric['metric_type']}: {metric['value']} {metric['unit']}")
except:
    print("\n⚠️  Metrics endpoints not available yet")

print("\n✨ API test complete!")
