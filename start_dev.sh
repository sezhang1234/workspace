#!/bin/bash

# Jiuwen Agent Studio Development Environment Startup
# This script starts the complete development environment with Docker

echo "🚀 Starting Jiuwen Agent Studio Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if required files exist
if [ ! -f "docker/docker-compose.dev.yml" ]; then
    echo "❌ docker-compose.dev.yml not found in docker/ directory"
    exit 1
fi

# Stop any existing containers first
echo "🛑 Stopping any existing containers..."
cd docker
docker-compose -f docker-compose.dev.yml down

# Start all development services
echo "🐳 Starting development services with Docker Compose..."
docker-compose -f docker-compose.dev.yml up -d

echo "⏳ Waiting for services to start..."
sleep 15

# Check service status
echo "📊 Service Status:"
docker-compose -f docker-compose.dev.yml ps

# Check if services are healthy
echo "🔍 Checking service health..."
if curl -s http://localhost:8000/api/health > /dev/null; then
    echo "✅ Backend is healthy"
else
    echo "⚠️  Backend health check failed, but it might still be starting..."
fi

if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is accessible"
else
    echo "⚠️  Frontend health check failed, but it might still be starting..."
fi

echo ""
echo "🎉 Development environment started!"
echo ""
echo "📍 Service URLs:"
echo "   Frontend:    http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs:    http://localhost:8000/api/docs"
echo "   Health:      http://localhost:8000/api/health"
echo ""
echo "📋 Useful commands:"
echo "   View logs:   docker-compose -f docker-compose.dev.yml logs -f"
echo "   Frontend:    docker-compose -f docker-compose.dev.yml logs -f frontend-dev"
echo "   Backend:     docker-compose -f docker-compose.dev.yml logs -f backend-dev"
echo "   Stop:        ./stop_dev.sh"
echo "   Restart:     docker-compose -f docker-compose.dev.yml restart"
echo ""
echo "🔄 Services will auto-restart on code changes"
echo "💡 If you encounter issues, check logs with: docker-compose -f docker-compose.dev.yml logs -f"