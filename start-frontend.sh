#!/bin/bash

echo "=========================================="
echo "Starting RTSP Overlay Frontend Server"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install
fi

# Start the Next.js development server
echo ""
echo "Starting Next.js server on http://localhost:3000"
echo "Press Ctrl+C to stop"
echo ""
pnpm dev
