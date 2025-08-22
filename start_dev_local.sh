#!/bin/bash

# Local Development Environment Startup (No Docker)
# This script starts the backend and frontend locally

echo "🚀 Starting Jiuwen Agent Studio Development Environment (Local Mode)..."

# Check if Python virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "❌ Virtual environment not found. Please run setup first."
    echo "   cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Check if Node.js dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend dependencies not found. Please run setup first."
    echo "   cd frontend && npm install"
    exit 1
fi

echo "🐍 Starting Backend (Python 3.13)..."
cd backend
source venv/bin/activate

# Start backend in background
echo "   Backend will start at: http://localhost:8000"
echo "   API Docs: http://localhost:8000/api/docs"
echo "   Health: http://localhost:8000/api/health"
python run_dev.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 5

echo ""
echo "⚛️  Starting Frontend (React + Vite)..."
cd ../frontend

# Start frontend in background
echo "   Frontend will start at: http://localhost:3000"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Local development environment started!"
echo ""
echo "📍 Service URLs:"
echo "   Frontend:    http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs:    http://localhost:8000/api/docs"
echo "   Health:      http://localhost:8000/api/health"
echo ""
echo "📋 Process IDs:"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "🛑 To stop services:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "💡 Backend will auto-restart on code changes"
echo "💡 Frontend will auto-reload on code changes"
echo ""
echo "🔍 Check service status:"
echo "   Backend:  curl http://localhost:8000/api/health"
echo "   Frontend: curl http://localhost:3000"