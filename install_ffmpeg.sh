#!/bin/bash

echo "========================================="
echo "FFmpeg Installation Script"
echo "========================================="
echo ""

# Check if FFmpeg is already installed
if command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg is already installed!"
    ffmpeg -version | head -1
    exit 0
fi

echo "📦 Installing FFmpeg..."
echo ""

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v apt-get &> /dev/null; then
        # Debian/Ubuntu
        echo "Detected: Debian/Ubuntu"
        sudo apt-get update
        sudo apt-get install -y ffmpeg
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        echo "Detected: CentOS/RHEL"
        sudo yum install -y ffmpeg
    else
        echo "❌ Unsupported Linux distribution"
        exit 1
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Detected: macOS"
    if command -v brew &> /dev/null; then
        brew install ffmpeg
    else
        echo "❌ Homebrew not found. Install from: https://brew.sh"
        exit 1
    fi
else
    echo "❌ Unsupported operating system: $OSTYPE"
    exit 1
fi

echo ""
echo "========================================="
echo "✅ FFmpeg Installation Complete!"
echo "========================================="
echo ""

# Verify installation
if command -v ffmpeg &> /dev/null; then
    echo "FFmpeg version:"
    ffmpeg -version | head -1
    echo ""
    echo "🎉 You can now use RTSP to HLS streaming!"
    echo ""
    echo "Next steps:"
    echo "1. Restart the backend server"
    echo "2. Check: curl http://localhost:5000/health"
    echo "3. Read: FFMPEG_SETUP.md for usage instructions"
else
    echo "❌ Installation failed. Please install manually."
    exit 1
fi
