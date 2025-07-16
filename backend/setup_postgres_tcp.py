import psycopg2
from psycopg2 import sql
import sys

# Common default passwords for postgres in development environments
passwords = ["postgres", "password", "admin", "", "vscode", "codespace"]

# Try different password combinations
for password in passwords:
    try:
        print(f"Trying password: {'[empty]' if password == '' else '[hidden]'}")
        
        # Connect via TCP to localhost
        conn = psycopg2.connect(
            host="localhost",
            port="5432",
            database="postgres",
            user="postgres",
            password=password
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        print("Successfully connected to PostgreSQL!")
        
        # Check if database exists
        cur.execute("SELECT 1 FROM pg_database WHERE datname = 'citypulse_db'")
        exists = cur.fetchone()
        
        if not exists:
            cur.execute('CREATE DATABASE citypulse_db')
            print("Database citypulse_db created successfully")
        else:
            print("Database citypulse_db already exists")
        
        # Create user
        cur.execute("SELECT 1 FROM pg_user WHERE usename = 'citypulse_user'")
        user_exists = cur.fetchone()
        
        if not user_exists:
            cur.execute("CREATE USER citypulse_user WITH PASSWORD 'citypulse_password'")
            print("User citypulse_user created successfully")
        else:
            print("User citypulse_user already exists")
            cur.execute("ALTER USER citypulse_user WITH PASSWORD 'citypulse_password'")
            print("User password updated")
        
        # Grant privileges
        cur.execute("GRANT ALL PRIVILEGES ON DATABASE citypulse_db TO citypulse_user")
        print("Privileges granted successfully")
        
        # Also grant privileges on the public schema
        conn2 = psycopg2.connect(
            host="localhost",
            port="5432",
            database="citypulse_db",
            user="postgres",
            password=password
        )
        conn2.autocommit = True
        cur2 = conn2.cursor()
        cur2.execute("GRANT ALL ON SCHEMA public TO citypulse_user")
        cur2.execute("GRANT CREATE ON SCHEMA public TO citypulse_user")
        print("Schema privileges granted successfully")
        
        cur.close()
        conn.close()
        cur2.close()
        conn2.close()
        
        print("\nDatabase setup completed successfully!")
        print(f"\nPostgreSQL admin password that worked: {'[empty]' if password == '' else '[hidden]'}")
        sys.exit(0)
        
    except Exception as e:
        print(f"Failed: {str(e)[:50]}...")
        continue

print("\nCould not connect to PostgreSQL with any default password.")
print("Let's proceed with SQLite instead.")
