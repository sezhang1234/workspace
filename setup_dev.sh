#!/bin/bash

# Jiuwen Agent Studio Development Environment Setup Script
# This script sets up the development environment for both frontend and backend

set -e

echo "🚀 Setting up Jiuwen Agent Studio Development Environment..."
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js is available: $(node --version)"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

echo "✅ Python is available: $(python3 --version)"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p data/postgres
mkdir -p data/redis

# Setup Backend
echo "🐍 Setting up Backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your configuration"
fi

cd ..

# Setup Frontend
echo "⚛️  Setting up Frontend..."
cd frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Jiuwen Agent Studio
VITE_APP_VERSION=1.0.0
EOF
    echo "✅ Frontend .env file created"
fi

cd ..

# Setup Docker environment
echo "🐳 Setting up Docker environment..."

# Create .env file for Docker if it doesn't exist
if [ ! -f "docker/.env" ]; then
    echo "Creating Docker .env file..."
    cat > docker/.env << EOF
# Docker Environment Variables
POSTGRES_DB=jiuwen_studio_dev
POSTGRES_USER=jiuwen_dev_user
POSTGRES_PASSWORD=jiuwen_dev_pass
POSTGRES_HOST=postgres-dev
POSTGRES_PORT=5432

REDIS_URL=redis://redis-dev:6379

BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

FRONTEND_HOST=0.0.0.0
FRONTEND_PORT=3000
EOF
    echo "✅ Docker .env file created"
fi

echo "=================================================="
echo "🎉 Development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development environment:"
echo "   ./start_dev.sh"
echo ""
echo "2. Or start individual services:"
echo "   # Backend only:"
echo "   cd backend && source venv/bin/activate && python run_dev.py"
echo "   # Frontend only:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/api/docs"
echo ""
echo "4. Stop the environment:"
echo "   ./stop_dev.sh"
echo "=================================================="