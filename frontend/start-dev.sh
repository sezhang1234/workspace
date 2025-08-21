#!/bin/sh

# Development startup script for frontend container

echo "🚀 Starting Frontend Development Server..."

# Wait for dependencies to be ready
echo "⏳ Waiting for dependencies..."
sleep 10

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Check if packages/workflow-canvas/node_modules exists
if [ ! -d "packages/workflow-canvas/node_modules" ]; then
    echo "📦 Installing workflow-canvas dependencies..."
    cd packages/workflow-canvas
    npm install --legacy-peer-deps
    cd ../..
fi

echo "✅ Dependencies ready, starting development server..."

# Start the development server
exec npm run dev -- --host 0.0.0.0