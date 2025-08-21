#!/bin/bash

# Test Frontend with Minimal Configuration
echo "🧪 Testing Frontend with Minimal Configuration..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "🐳 Stopping any existing containers..."
cd docker
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
docker-compose -f docker-compose.minimal.yml down 2>/dev/null || true

echo "🧹 Cleaning up..."
docker system prune -f

echo "🔨 Building minimal frontend container..."
docker-compose -f docker-compose.minimal.yml build --no-cache frontend-test

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Let's see the error:"
    docker-compose -f docker-compose.minimal.yml build frontend-test
    exit 1
fi

echo "🚀 Starting minimal frontend..."
docker-compose -f docker-compose.minimal.yml up -d

echo "⏳ Waiting for container to start..."
sleep 15

echo "📊 Container status:"
docker-compose -f docker-compose.minimal.yml ps

echo ""
echo "🔍 Container logs:"
docker-compose -f docker-compose.minimal.yml logs --tail=20 frontend-test

echo ""
echo "🌐 Testing if frontend is accessible..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is accessible at http://localhost:3000"
else
    echo "❌ Frontend is not accessible"
    echo "📋 Checking container status:"
    docker-compose -f docker-compose.minimal.yml ps
    echo ""
    echo "🔍 Recent logs:"
    docker-compose -f docker-compose.minimal.yml logs --tail=10 frontend-test
fi

echo ""
echo "📋 Commands:"
echo "   View logs: docker-compose -f docker-compose.minimal.yml logs -f frontend-test"
echo "   Stop:      docker-compose -f docker-compose.minimal.yml down"