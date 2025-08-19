#!/usr/bin/env python3
"""
Setup script for Jiuwen Agent Studio Backend
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        if e.stdout:
            print(f"STDOUT: {e.stdout}")
        if e.stderr:
            print(f"STDERR: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 11):
        print(f"❌ Python {version.major}.{version.minor} detected. Python 3.11+ is required.")
        return False
    print(f"✅ Python {version.major}.{version.minor} detected")
    return True

def setup_environment():
    """Setup the Python environment"""
    print("🚀 Setting up Jiuwen Agent Studio Backend Environment...")
    
    # Check Python version
    if not check_python_version():
        return False
    
    # Create virtual environment if it doesn't exist
    venv_path = Path("venv")
    if not venv_path.exists():
        print("🔄 Creating virtual environment...")
        if not run_command("python3 -m venv venv", "Creating virtual environment"):
            return False
    
    # Activate virtual environment and install dependencies
    if os.name == 'nt':  # Windows
        pip_cmd = "venv\\Scripts\\pip"
        python_cmd = "venv\\Scripts\\python"
    else:  # Unix/Linux/macOS
        pip_cmd = "venv/bin/pip"
        python_cmd = "venv/bin/python"
    
    # Upgrade pip
    if not run_command(f"{pip_cmd} install --upgrade pip", "Upgrading pip"):
        return False
    
    # Install requirements
    if not run_command(f"{pip_cmd} install -r requirements.txt", "Installing dependencies"):
        return False
    
    print("\n🎉 Environment setup complete!")
    print(f"🐍 Python: {python_cmd}")
    print(f"📦 Pip: {pip_cmd}")
    print("\nTo activate the virtual environment:")
    if os.name == 'nt':
        print("  venv\\Scripts\\activate")
    else:
        print("  source venv/bin/activate")
    
    return True

if __name__ == "__main__":
    if not setup_environment():
        sys.exit(1)