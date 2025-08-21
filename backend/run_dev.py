#!/usr/bin/env python3
"""
Development server runner for Jiuwen Agent Studio Backend
"""
import uvicorn
import os
from dotenv import load_dotenv

def main():
    # Load environment variables
    load_dotenv()
    
    # Development configuration
    config = {
        "host": os.getenv("HOST", "0.0.0.0"),
        "port": int(os.getenv("PORT", "8000")),
        "reload": True,
        "log_level": "info",
        "access_log": True
    }
    
    print("🚀 Starting Jiuwen Agent Studio Backend in development mode...")
    print(f"📍 Server will be available at: http://{config['host']}:{config['port']}")
    print(f"📚 API Documentation: http://{config['host']}:{config['port']}/api/docs")
    print(f"🔍 Health Check: http://{config['host']}:{config['port']}/api/health")
    print("🔄 Auto-reload enabled for development")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 60)
    
    # Start the server
    uvicorn.run(
        "main:app",
        **config
    )

if __name__ == "__main__":
    main()