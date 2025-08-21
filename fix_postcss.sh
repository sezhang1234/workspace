#!/bin/bash

# Fix PostCSS Configuration Issue
echo "🔧 Fixing PostCSS Configuration Issue..."

echo "📁 Checking current PostCSS config..."
cd frontend

echo "Current postcss.config.js:"
cat postcss.config.js

echo ""
echo "✅ PostCSS config has been updated to use CommonJS syntax"
echo "🔄 Now let's rebuild the container..."

cd ../docker
docker-compose -f docker-compose.dev.yml down

echo "🧹 Cleaning up..."
docker system prune -f

echo "🔨 Rebuilding frontend container..."
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
echo "✅ PostCSS issue should now be fixed!"
echo "🌐 Access at: http://localhost:3000"