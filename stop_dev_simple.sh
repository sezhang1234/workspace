#!/bin/bash

# Stop Jiuwen Agent Studio Backend Services
echo "🛑 Stopping Jiuwen Agent Studio Backend Services..."

# Stop backend services
echo "🐳 Stopping backend services..."
cd docker
docker-compose -f docker-compose.backend.yml down

echo "🧹 Cleaning up..."
# Remove unused containers, networks, and images
docker system prune -f

echo ""
echo "✅ Backend services stopped!"
echo ""
echo "💡 To start again, run: ./start_dev_simple.sh"