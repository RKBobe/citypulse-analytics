import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from app.db.base import engine
from app.models.models import Base

def init_db():
    """Initialize the database by creating all tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
