# Troubleshooting Guide

## HLS Stream Errors

### Error: "HLS error: {}" or Network Error

This error typically occurs when the video player cannot load the HLS playlist. Here are the common causes and solutions:

#### 1. Backend Server Not Running

**Symptoms:**
- HLS error with empty object `{}`
- Network error: "Cannot connect to stream"
- 404 error when loading stream

**Solution:**
```bash
# Start the backend server
cd backend
python app.py
```

The backend should start on `http://localhost:5000`. You should see:
```
* Running on http://0.0.0.0:5000
```

#### 2. Stream Not Started

**Symptoms:**
- 404 error: "Stream not found"
- File not found error

**Solution:**
1. Make sure the backend is running
2. Go to the "RTSP Streams" section in the sidebar
3. Click "Add Stream" and enter:
   - Stream ID: e.g., `camera1`
   - RTSP URL: Your RTSP stream URL (must start with `rtsp://`)
4. Click "Start Stream"
5. Copy the HLS URL and paste it in the "Custom HLS URL" field

#### 3. FFmpeg Not Installed

**Symptoms:**
- Backend error: "FFmpeg is not installed"
- Stream fails to start

**Solution:**

**Linux/Ubuntu:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
Download from https://ffmpeg.org/download.html and add to PATH

Verify installation:
```bash
ffmpeg -version
```

#### 4. Invalid RTSP URL

**Symptoms:**
- Stream starts but immediately fails
- FFmpeg errors in backend logs

**Solution:**
- Ensure RTSP URL is correct and accessible
- Test RTSP URL with VLC or another player first
- Check network connectivity to the RTSP source
- Verify RTSP credentials if required

#### 5. CORS Issues

**Symptoms:**
- CORS policy error in browser console
- Access-Control-Allow-Origin errors

**Solution:**
The backend is already configured with CORS support. If you still see CORS errors:
1. Check that backend is running on the correct port (5000)
2. Verify `.env.local` has correct API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
3. Restart both frontend and backend

#### 6. Port Already in Use

**Symptoms:**
- Backend fails to start
- "Address already in use" error

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=5001 python backend/app.py
```

If using a different port, update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Testing with Demo Streams

If you don't have an RTSP source, use the built-in demo streams:

1. Click on any demo stream in the "Stream Sources" section:
   - Big Buck Bunny
   - Tears of Steel
   - Apple Test Stream

These are public HLS streams that work without a backend.

## Checking Backend Health

Visit `http://localhost:5000/health` in your browser. You should see:
```json
{
  "status": "healthy",
  "message": "RTSP Overlay API is running",
  "database": "connected",
  "ffmpeg": "installed",
  "active_streams": 0,
  "websocket": "enabled"
}
```

## Common Workflow

1. **Start Backend:**
   ```bash
   cd backend
   python app.py
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Add RTSP Stream:**
   - Click "Add Stream" in RTSP Streams section
   - Enter Stream ID and RTSP URL
   - Click "Start Stream"

4. **Use HLS URL:**
   - Copy the HLS URL from the stream card
   - Paste it in "Custom HLS URL" field
   - Click "Load Stream"

## Still Having Issues?

1. Check browser console for detailed error messages (F12)
2. Check backend terminal for FFmpeg errors
3. Verify all dependencies are installed:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Frontend
   npm install
   ```
4. Try using a demo stream first to verify the player works
5. Test your RTSP URL with VLC or another player before using it here

## Quick Start Script

Use the provided start script to launch both servers:
```bash
./start-all.sh
```

Or start them separately:
```bash
# Terminal 1 - Backend
./start-backend.sh

# Terminal 2 - Frontend
./start-frontend.sh
```
