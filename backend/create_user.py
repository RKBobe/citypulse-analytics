from app.db.base import SessionLocal
from app.models.models import User
from sqlalchemy.exc import IntegrityError
import hashlib

db = SessionLocal()

try:
    # Simple password hashing (in production, use bcrypt or similar)
    password = "testpassword"
    # Using SHA256 for simple hashing (not secure for production!)
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    # Create a test user with all required fields
    test_user = User(
        username="testuser",
        email="test@citypulse.com",
        hashed_password=hashed_password,
        is_active=True
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    print(f"✓ Created user: {test_user.username} (ID: {test_user.id})")
    print(f"  Email: {test_user.email}")
    print(f"  Active: {test_user.is_active}")
    print(f"  Password: testpassword (hashed in database)")
    
    # List all users
    users = db.query(User).all()
    print(f"\nTotal users: {len(users)}")
    for user in users:
        print(f"  - Username: {user.username}, ID: {user.id}, Email: {user.email}, Active: {user.is_active}")
        
except IntegrityError as e:
    print(f"User might already exist: {e}")
    db.rollback()
    # List existing users
    users = db.query(User).all()
    print(f"\nExisting users: {len(users)}")
    for user in users:
        print(f"  - {user.username} (ID: {user.id})")
except Exception as e:
    print(f"Error: {e}")
    print(f"Error type: {type(e)}")
    db.rollback()
finally:
    db.close()
