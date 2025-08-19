#!/usr/bin/env python3
"""
Database initialization script for Jiuwen Agent Studio
"""

import os
import sys
from pathlib import Path

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent))

from app.core.database import create_tables, engine
from app.core.config import settings

def init_database():
    """Initialize the database and create tables"""
    print("🚀 Initializing Jiuwen Agent Studio Database...")
    
    try:
        # Test database connection
        with engine.connect() as conn:
            print("✅ Database connection successful")
        
        # Create tables
        create_tables()
        print("✅ Database tables created successfully")
        
        print("\n🎉 Database initialization complete!")
        print(f"📊 Database URL: {settings.DATABASE_URL}")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        print("\n🔧 Troubleshooting tips:")
        print("1. Make sure PostgreSQL is running")
        print("2. Check your DATABASE_URL in .env file")
        print("3. Ensure the database exists and is accessible")
        sys.exit(1)

if __name__ == "__main__":
    init_database()