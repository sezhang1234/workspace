#!/bin/bash

# Debug Frontend Container Restart Loop
echo "🔍 Debugging Frontend Container Restart Loop..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "📊 Current container status:"
cd docker
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "🔄 Container restart count:"
docker-compose -f docker-compose.dev.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "📋 Recent frontend logs (last 50 lines):"
docker-compose -f docker-compose.dev.yml logs --tail=50 frontend-dev

echo ""
echo "🐳 Docker system info:"
docker system df

echo ""
echo "🔍 Checking for port conflicts:"
netstat -tlnp | grep :3000 || echo "Port 3000 is not in use"

echo ""
echo "📁 Checking frontend files:"
ls -la ../frontend/
echo ""
echo "📦 Checking package.json:"
cat ../frontend/package.json | head -20

echo ""
echo "💡 Debugging tips:"
echo "1. Check if all dependencies are installed"
echo "2. Verify file permissions"
echo "3. Check for port conflicts"
echo "4. Review the logs above for specific errors"