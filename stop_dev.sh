#!/bin/bash

# Jiuwen Agent Studio Development Environment Shutdown
# This script stops the complete development environment

echo "🛑 Stopping Jiuwen Agent Studio Development Environment..."

# Check if required files exist
if [ ! -f "docker/docker-compose.dev.yml" ]; then
    echo "❌ docker-compose.dev.yml not found in docker/ directory"
    exit 1
fi

# Stop all development services
echo "🐳 Stopping development services..."
cd docker
docker-compose -f docker-compose.dev.yml down

echo "🧹 Cleaning up..."
# Remove unused containers, networks, and images
docker system prune -f

echo ""
echo "✅ Development environment stopped!"
echo ""
echo "💡 To start again, run: ./start_dev.sh"
echo "💡 To start backend only, run: ./start_dev_simple.sh"