#!/bin/bash

echo "🚀 CityPulse Backend Verification Script (No Sudo)"
echo "=================================================="

# Check Python
echo "✓ Checking Python..."
python --version

# Check if we can connect to PostgreSQL
echo "✓ Checking PostgreSQL connection..."
python -c "
try:
    import psycopg2
    conn = psycopg2.connect('postgresql://postgres:postgres@localhost:5432/citypulse')
    print('  ✅ Database connection successful')
    conn.close()
except Exception as e:
    print(f'  ❌ Database connection failed: {e}')
"

# Check virtual environment
echo "✓ Checking virtual environment..."
if [[ "$VIRTUAL_ENV" != "" ]]; then
    echo "  ✅ Virtual environment is activated"
else
    echo "  ⚠️  Virtual environment not activated"
fi

# Check dependencies
echo "✓ Checking key dependencies..."
python -c "
import importlib
deps = ['fastapi', 'sqlalchemy', 'psycopg2', 'pydantic', 'uvicorn']
for dep in deps:
    try:
        importlib.import_module(dep)
        print(f'  ✅ {dep} installed')
    except ImportError:
        print(f'  ❌ {dep} missing')
"

# Test database tables
echo "✓ Checking database tables..."
python -c "
from app.db.base import SessionLocal
from app.models.models import User, Dashboard, Widget, CityMetric
try:
    db = SessionLocal()
    print(f'  Tables found:')
    print(f'    - Users: {db.query(User).count()} records')
    print(f'    - Dashboards: {db.query(Dashboard).count()} records')
    print(f'    - Widgets: {db.query(Widget).count()} records')
    print(f'    - Metrics: {db.query(CityMetric).count()} records')
    db.close()
except Exception as e:
    print(f'  ❌ Error checking tables: {e}')
"

echo ""
echo "✨ Verification complete!"
EOF

chmod +x backend/verify_setup_no_sudo.sh
