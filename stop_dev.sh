#!/bin/bash

# Stop Jiuwen Agent Studio Development Environment
echo "🛑 Stopping Jiuwen Agent Studio Development Environment..."

# Stop development services
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