#!/bin/bash

# Simple Development Environment Startup
# This script starts only the backend services in Docker and runs frontend locally

echo "🚀 Starting Jiuwen Agent Studio Development Environment (Simple Mode)..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start only backend services (PostgreSQL, Redis, Backend)
echo "🐳 Starting backend services with Docker Compose..."
cd docker
docker-compose -f docker-compose.backend.yml up -d

echo "⏳ Waiting for backend services to start..."
sleep 10

# Check service status
echo "📊 Backend Service Status:"
docker-compose -f docker-compose.backend.yml ps

echo ""
echo "🎉 Backend services started!"
echo ""
echo "📍 Backend URLs:"
echo "   Backend API:  http://localhost:8000"
echo "   API Docs:     http://localhost:8000/api/docs"
echo "   Health:       http://localhost:8000/api/health"
echo ""
echo "⚛️  Now start the frontend locally:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose -f docker-compose.backend.yml logs -f backend-dev"
echo "   Stop:      docker-compose -f docker-compose.backend.yml down"
echo "   Restart:   docker-compose -f docker-compose.backend.yml restart backend-dev"
echo ""
echo "🔄 Backend will auto-restart on code changes"