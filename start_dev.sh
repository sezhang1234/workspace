#!/bin/bash

# Start Jiuwen Agent Studio Development Environment
echo "🚀 Starting Jiuwen Agent Studio Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start development services
echo "🐳 Starting development services with Docker Compose..."
cd docker
docker-compose -f docker-compose.dev.yml up -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "📊 Service Status:"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "🎉 Development environment started!"
echo ""
echo "📍 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/api/docs"
echo "   Health:   http://localhost:8000/api/health"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "   Stop:      docker-compose -f docker-compose.dev.yml down"
echo "   Restart:   docker-compose -f docker-compose.dev.yml restart"
echo ""
echo "🔄 Services will auto-restart on code changes"