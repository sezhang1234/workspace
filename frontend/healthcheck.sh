#!/bin/sh

# Health check script for frontend container
# Check if the development server is responding

# Wait a bit for the server to start
sleep 5

# Check if the server is responding
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "Frontend is healthy"
    exit 0
else
    echo "Frontend is not responding"
    exit 1
fi