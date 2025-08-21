#!/bin/bash

# Fix Frontend Container Restart Loop - Version 2
echo "🔧 Fixing Frontend Container Restart Loop (Version 2)..."

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

echo "🔨 Rebuilding frontend container with no cache..."
docker-compose -f docker-compose.dev.yml build --no-cache frontend-dev

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed. Let's try a different approach..."
    
    echo "🔄 Attempting to fix dependency issues..."
    cd ../frontend
    
    # Clean up and reinstall dependencies
    rm -rf node_modules package-lock.json
    npm install --legacy-peer-deps
    
    cd ../docker
    
    echo "🔨 Rebuilding frontend container again..."
    docker-compose -f docker-compose.dev.yml build --no-cache frontend-dev
    
    if [ $? -ne 0 ]; then
        echo "❌ Build still failing. Let's check the logs..."
        echo "📋 Build logs:"
        docker-compose -f docker-compose.dev.yml build frontend-dev
        exit 1
    fi
fi

echo "🚀 Starting services..."
docker-compose -f docker-compose.dev.yml up -d

echo "⏳ Waiting for services to start..."
sleep 20

echo "📊 Container status:"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "🔍 Checking frontend logs..."
docker-compose -f docker-compose.dev.yml logs --tail=30 frontend-dev

echo ""
echo "💚 Checking container health..."
docker-compose -f docker-compose.dev.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Health}}"

echo ""
echo "✅ Frontend container should now be working!"
echo "🌐 Access your application at: http://localhost:3000"
echo ""
echo "📋 Useful commands:"
echo "   View logs: docker-compose -f docker-compose.dev.yml logs -f frontend-dev"
echo "   Restart:  docker-compose -f docker-compose.dev.yml restart frontend-dev"
echo "   Stop:     docker-compose -f docker-compose.dev.yml down"
echo "   Debug:    ../debug_frontend.sh"