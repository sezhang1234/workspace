#!/bin/bash

# Quick Fix for Frontend Container Restart Loop
echo "⚡ Quick Fix for Frontend Container Restart Loop..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "🐳 Stopping all containers..."
cd docker
docker-compose -f docker-compose.dev.yml down

echo "🧹 Cleaning up..."
docker system prune -f

echo "🔨 Building frontend with simple Dockerfile..."
docker-compose -f docker-compose.dev.yml build --no-cache frontend-dev

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Let's see the error:"
    docker-compose -f docker-compose.dev.yml build frontend-dev
    exit 1
fi

echo "🚀 Starting services..."
docker-compose -f docker-compose.dev.yml up -d

echo "⏳ Waiting for services to start..."
sleep 15

echo "📊 Container status:"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "🔍 Frontend logs:"
docker-compose -f docker-compose.dev.yml logs --tail=20 frontend-dev

echo ""
echo "✅ Frontend should now be working!"
echo "🌐 Access at: http://localhost:3000"
echo ""
echo "📋 Commands:"
echo "   View logs: docker-compose -f docker-compose.dev.yml logs -f frontend-dev"
echo "   Stop:      docker-compose -f docker-compose.dev.yml down"