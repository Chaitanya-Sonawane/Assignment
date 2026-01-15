#!/bin/bash

echo "=========================================="
echo "Starting RTSP Overlay Backend Server"
echo "=========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Warning: FFmpeg is not installed"
    echo "Install it with: sudo apt-get install ffmpeg"
    echo "The application will work but RTSP streaming will not be available"
fi

# Navigate to backend directory
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create HLS directory
mkdir -p hls

# Check MongoDB connection
echo "Checking MongoDB connection..."
if ! command -v mongod &> /dev/null; then
    echo "Warning: MongoDB is not installed"
    echo "The application will use in-memory storage (data will not persist)"
fi

# Start the Flask server
echo ""
echo "Starting Flask server on http://localhost:5000"
echo "Press Ctrl+C to stop"
echo ""
python app.py
