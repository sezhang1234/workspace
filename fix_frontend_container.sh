#!/bin/bash

# Fix Frontend Container Restart Loop Script
echo "🔧 Fixing Frontend Container Restart Loop..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "🐳 Stopping all containers..."
cd docker
docker-compose -f docker-compose.dev.yml down

echo "🧹 Cleaning up containers and images..."
docker system prune -f

echo "🗑️  Removing problematic frontend image..."
docker rmi $(docker images | grep frontend-dev | awk '{print $3}') 2>/dev/null || echo "No frontend image to remove"

echo "🔨 Rebuilding frontend container..."
docker-compose -f docker-compose.dev.yml build --no-cache frontend-dev

echo "🚀 Starting services..."
docker-compose -f docker-compose.dev.yml up -d

echo "⏳ Waiting for services to start..."
sleep 15

echo "📊 Container status:"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "🔍 Checking frontend logs..."
docker-compose -f docker-compose.dev.yml logs frontend-dev --tail=20

echo ""
echo "✅ Frontend container should now be working!"
echo "🌐 Access your application at: http://localhost:3000"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose -f docker-compose.dev.yml logs -f frontend-dev"
echo "   Restart:  docker-compose -f docker-compose.dev.yml restart frontend-dev"
echo "   Stop:     docker-compose -f docker-compose.dev.yml down"