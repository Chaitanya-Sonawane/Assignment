#!/bin/bash

echo "=========================================="
echo "Starting RTSP Overlay Application"
echo "=========================================="

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend in background
echo "Starting backend server..."
./start-backend.sh &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend in background
echo "Starting frontend server..."
./start-frontend.sh &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo "Application is running!"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo "Press Ctrl+C to stop all servers"
echo "=========================================="

# Wait for both processes
wait
