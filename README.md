# RTSP Livestream Overlay Web Application

A professional web application for playing live RTSP/HLS streams and managing real-time video overlays with drag-and-drop functionality.

## Features

### Core Functionality
- **RTSP Stream Support**: Convert RTSP streams to HLS using FFmpeg
- **HLS Playback**: Play HLS streams with full video controls
- **Text Overlays**: Add customizable text overlays on video
- **Image Overlays**: Add logo/image overlays via URL
- **Drag-and-Drop**: Move overlays freely on video surface
- **Resizing**: Resize overlays interactively
- **Real-Time Sync**: WebSocket-based live overlay synchronization
- **Persistent Storage**: MongoDB database for overlay configuration
- **Multi-Client Support**: Multiple users see same overlays in real-time

## Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: MongoDB
- **Real-Time**: Flask-SocketIO (WebSockets)
- **Video**: FFmpeg (RTSP to HLS conversion)
- **Requirements**: Python 3.8+

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4
- **WebSocket**: Socket.IO Client
- **Video Player**: HLS.js

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- MongoDB (local or cloud)
- FFmpeg (for RTSP conversion)

### Backend Setup

1. **Install FFmpeg**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install ffmpeg

   # macOS
   brew install ffmpeg

   # Windows
   # Download from https://ffmpeg.org/download.html
   ```

2. **Install Python Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/
   DATABASE_NAME=rtsp_overlay_db
   COLLECTION_NAME=overlays
   DEBUG=True
   PORT=5000
   ```

   **For Cloud MongoDB** (e.g., MongoDB Atlas):
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

4. **Start Backend Server**
   ```bash
   python app.py
   ```
   
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:3000`

## Usage Guide

### Playing a Stream

#### From Demo Streams
1. Open the application in browser
2. Click "Load Demo Stream" in the sidebar
3. Select a demo stream to play

#### From Custom HLS URL
1. Paste an HLS URL in the text field
2. Click "Load Custom URL"
3. Stream will load and play

#### From RTSP Source
1. In the "RTSP Streams" section, click "Add RTSP Stream"
2. Enter a unique Stream ID (e.g., "camera1")
3. Enter RTSP URL (e.g., `rtsp://192.168.1.100:554/stream`)
4. Click "Start Stream"
5. Wait for FFmpeg conversion (10-30 seconds)
6. Copy the HLS URL and paste in "Load Custom URL"

### Managing Overlays

#### Create Text Overlay
1. Click "Add Overlay" in the Overlays section
2. Select "Text" type
3. Enter text content
4. Set position (X, Y coordinates)
5. Set size (width, height)
6. Click "Create"

#### Create Image Overlay
1. Click "Add Overlay"
2. Select "Image" type
3. Enter image URL (must be publicly accessible)
4. Set position and size
5. Click "Create"

#### Move Overlay
1. Click on overlay in the video area
2. Drag to new position
3. Changes sync in real-time

#### Resize Overlay
1. Click on overlay
2. Drag the resize handle (bottom-right corner)
3. All clients see resize in real-time

#### Edit Overlay
1. Click the edit icon next to overlay in list
2. Modify properties
3. Click "Update"

#### Delete Overlay
1. Click the delete icon next to overlay
2. Confirm deletion

## API Documentation

### Authentication
Currently no authentication. In production, implement OAuth2 or JWT tokens.

### REST Endpoints

#### Overlays

**Create Overlay**
```
POST /api/overlays
Content-Type: application/json

{
  "type": "text",
  "content": "My Text",
  "position": { "x": 10, "y": 20 },
  "size": { "width": 200, "height": 50 }
}

Response: 201 Created
{
  "message": "Overlay created successfully",
  "id": "507f1f77bcf86cd799439011"
}
```

**Get All Overlays**
```
GET /api/overlays

Response: 200 OK
{
  "overlays": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "type": "text",
      "content": "My Text",
      "position": { "x": 10, "y": 20 },
      "size": { "width": 200, "height": 50 }
    }
  ]
}
```

**Get Single Overlay**
```
GET /api/overlays/{overlay_id}

Response: 200 OK
{
  "overlay": { ... }
}
```

**Update Overlay**
```
PUT /api/overlays/{overlay_id}
Content-Type: application/json

{
  "position": { "x": 30, "y": 40 }
}

Response: 200 OK
{
  "message": "Overlay updated successfully"
}
```

**Delete Overlay**
```
DELETE /api/overlays/{overlay_id}

Response: 200 OK
{
  "message": "Overlay deleted successfully"
}
```

#### RTSP Streams

**Start RTSP Stream**
```
POST /api/streams
Content-Type: application/json

{
  "stream_id": "camera1",
  "rtsp_url": "rtsp://192.168.1.100:554/stream"
}

Response: 201 Created
{
  "message": "Stream started successfully",
  "stream": {
    "stream_id": "camera1",
    "rtsp_url": "rtsp://192.168.1.100:554/stream",
    "hls_url": "/hls/camera1.m3u8",
    "status": "running",
    "pid": 12345
  }
}
```

**List Active Streams**
```
GET /api/streams

Response: 200 OK
{
  "streams": [ ... ]
}
```

**Get Stream Info**
```
GET /api/streams/{stream_id}

Response: 200 OK
{
  "stream": { ... }
}
```

**Stop Stream**
```
DELETE /api/streams/{stream_id}

Response: 200 OK
{
  "message": "Stream stopped successfully"
}
```

**Stop All Streams**
```
POST /api/streams/stop-all

Response: 200 OK
{
  "message": "All streams stopped"
}
```

### WebSocket Events

**Connection**
```javascript
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('connection_response', (data) => {
  console.log('Connection status:', data);
});
```

**Overlay Events**
```javascript
// Listen for overlay creation from other clients
socket.on('overlay_created', (overlay) => {
  // Add overlay to UI
});

// Listen for overlay updates
socket.on('overlay_updated', (data) => {
  // data: { id: string, overlay: Overlay }
});

// Listen for deletions
socket.on('overlay_deleted', (data) => {
  // data: { id: string }
});

// Real-time position updates
socket.on('overlay_moved', (data) => {
  // data: { id: string, position: { x, y } }
});

// Real-time size updates
socket.on('overlay_resized', (data) => {
  // data: { id: string, size: { width, height } }
});
```

## Configuration

### MongoDB Connection
- **Local**: `mongodb://localhost:27017/`
- **Cloud (Atlas)**: `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority`

### FFmpeg Options
Located in `backend/stream_manager.py`:
- Segment duration: 2 seconds
- Playlist size: 5 segments
- Video codec: libx264 (H.264)
- Audio codec: aac

### Video Player Options
Located in `components/video-player.tsx`:
- HLS timeout: 10 seconds
- Max load time: 20 seconds
- Auto-retry: enabled

## Troubleshooting

### FFmpeg Not Found
```
Error: FFmpeg is not installed
Solution: Install FFmpeg on your system
```

### RTSP Stream Not Starting
- Verify RTSP URL is correct and accessible
- Check if camera/source requires authentication
- Increase FFmpeg timeout in stream_manager.py

### WebSocket Connection Failed
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify firewall allows WebSocket connections

### MongoDB Connection Error
- Verify MongoDB is running
- Check connection string in .env
- For cloud MongoDB, verify IP whitelist

### Overlay Not Appearing
- Ensure overlay content is not empty
- Check position is within video bounds
- Verify overlay size is > 0

## Deployment

### Production Considerations
1. **Security**
   - Implement authentication (JWT/OAuth2)
   - Add HTTPS/SSL certificates
   - Enable CORS properly
   - Validate all inputs

2. **Database**
   - Use MongoDB Atlas for cloud hosting
   - Enable encryption at rest
   - Configure backups

3. **Backend**
   - Use production WSGI server (Gunicorn)
   - Set DEBUG=False
   - Use environment variables for secrets

4. **Frontend**
   - Build for production: `npm run build`
   - Deploy to Vercel or similar
   - Configure proper API endpoints

## Support

For issues and questions:
- Check existing GitHub issues
- Create detailed bug reports
- Include error messages and steps to reproduce

## License

MIT License - see LICENSE file for details

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request
