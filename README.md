# RTSP Livestream Overlay Web Application

A professional web application for playing live RTSP/HLS streams and managing real-time video overlays with drag-and-drop functionality.

## 📹 Demo Video

**[Watch Demo Video on Google Drive](https://drive.google.com/file/d/1bYACGxJ-7GdQonwnPFrk7_uQ1W2xH5xH/view?usp=drive_link)**

The demo video demonstrates:
- **Core Features and Workflow**: Complete application functionality walkthrough
- **Real-time Functionality**: Live overlay synchronization and WebSocket communication
- **UI/UX Walkthrough**: User interface navigation and interaction patterns
- **Use-case Demonstration**: Practical scenarios including:
  - Starting the application
  - Playing RTSP livestream
  - Creating, updating, and deleting overlays
  - Drag-and-drop overlay positioning
  - Real-time overlay behavior and multi-client synchronization

---

## 🎯 Features

### Core Functionality
- **RTSP Stream Support**: Convert RTSP streams to HLS using FFmpeg
- **HLS Playback**: Play HLS streams with full video controls
- **MP4 Support**: Direct playback of MP4 video files
- **Text Overlays**: Add customizable text overlays on video
- **Image Overlays**: Add logo/image overlays via URL
- **Drag-and-Drop**: Move overlays freely on video surface
- **Resizing**: Resize overlays interactively
- **Real-Time Sync**: WebSocket-based live overlay synchronization
- **Persistent Storage**: MongoDB database for overlay configuration
- **Multi-Client Support**: Multiple users see same overlays in real-time

---

## 🛠 Technology Stack

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
- **Video Player**: HLS.js with native MP4 support

---

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- MongoDB (local or cloud)
- FFmpeg (for RTSP conversion)

---

## 🚀 Installation & Setup

### 1. Install FFmpeg

**Ubuntu/Debian:**
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

**Verify installation:**
```bash
ffmpeg -version
```

### 2. Backend Setup

**Install Python Dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

**Configure Environment Variables:**
```bash
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/
DATABASE_NAME=rtsp_overlay_db
COLLECTION_NAME=overlays
DEBUG=True
PORT=5000
```

**For Cloud MongoDB (MongoDB Atlas):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

**Start Backend Server:**
```bash
python app.py
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

**Install Dependencies:**
```bash
npm install
```

**Configure Environment Variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Start Development Server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Quick Start (Both Servers)

Use the provided scripts:
```bash
# Start both servers
./start-all.sh

# Or individually:
./start-backend.sh  # Backend only
./start-frontend.sh # Frontend only
```

---

## 📖 Usage Guide

### Playing a Stream

#### From Demo Streams
1. Open the application at `http://localhost:3000`
2. Click on any demo stream button in the sidebar
3. Video will start playing automatically

Available demo streams:
- Big Buck Bunny (Local MP4)
- Big Buck Bunny (HLS)
- Apple Demo Stream
- Sintel Movie
- Tears of Steel

#### From Custom HLS URL or MP4
1. Paste an HLS URL or MP4 URL in the text field
2. Click "Load Stream"
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
3. Changes sync in real-time across all clients

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
2. Overlay is removed immediately

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000
```

### Overlay Endpoints

#### POST /api/overlays
Create a new overlay

**Request Body:**
```json
{
  "type": "text|image",
  "content": "string",
  "position": {
    "x": 10,
    "y": 20
  },
  "size": {
    "width": 200,
    "height": 50
  }
}
```

**Response (201 Created):**
```json
{
  "message": "Overlay created successfully",
  "id": "507f1f77bcf86cd799439011"
}
```

#### GET /api/overlays
Get all overlays

**Response (200 OK):**
```json
{
  "overlays": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "type": "text",
      "content": "LIVE",
      "position": { "x": 10, "y": 20 },
      "size": { "width": 200, "height": 50 }
    }
  ]
}
```

#### GET /api/overlays/{id}
Get single overlay by ID

**Response (200 OK):**
```json
{
  "overlay": {
    "_id": "507f1f77bcf86cd799439011",
    "type": "text",
    "content": "LIVE",
    "position": { "x": 10, "y": 20 },
    "size": { "width": 200, "height": 50 }
  }
}
```

#### PUT /api/overlays/{id}
Update overlay (partial update supported)

**Request Body:**
```json
{
  "position": { "x": 30, "y": 40 },
  "content": "Updated Text"
}
```

**Response (200 OK):**
```json
{
  "message": "Overlay updated successfully"
}
```

#### DELETE /api/overlays/{id}
Delete overlay

**Response (200 OK):**
```json
{
  "message": "Overlay deleted successfully"
}
```

### Stream Endpoints

#### POST /api/streams
Start RTSP to HLS stream

**Request Body:**
```json
{
  "stream_id": "camera1",
  "rtsp_url": "rtsp://192.168.1.100:554/stream"
}
```

**Response (201 Created):**
```json
{
  "message": "Stream started successfully",
  "stream": {
    "stream_id": "camera1",
    "rtsp_url": "rtsp://...",
    "hls_url": "/hls/camera1.m3u8",
    "status": "running",
    "pid": 12345
  }
}
```

#### GET /api/streams
List all active streams

**Response (200 OK):**
```json
{
  "streams": [
    {
      "stream_id": "camera1",
      "rtsp_url": "rtsp://...",
      "hls_url": "/hls/camera1.m3u8",
      "status": "running",
      "pid": 12345
    }
  ]
}
```

#### GET /api/streams/{stream_id}
Get stream information

**Response (200 OK):**
```json
{
  "stream": {
    "stream_id": "camera1",
    "rtsp_url": "rtsp://...",
    "hls_url": "/hls/camera1.m3u8",
    "status": "running",
    "pid": 12345
  }
}
```

#### DELETE /api/streams/{stream_id}
Stop a running stream

**Response (200 OK):**
```json
{
  "message": "Stream stopped successfully"
}
```

#### POST /api/streams/stop-all
Stop all running streams

**Response (200 OK):**
```json
{
  "message": "All streams stopped"
}
```

### WebSocket Events

Connect to `http://localhost:5000` with Socket.IO client

#### Server → Client Events

**connection_response**
```json
{
  "status": "connected"
}
```

**overlay_created**
```json
{
  "_id": "string",
  "type": "text|image",
  "content": "string",
  "position": { "x": 10, "y": 20 },
  "size": { "width": 200, "height": 50 }
}
```

**overlay_updated**
```json
{
  "id": "string",
  "overlay": { }
}
```

**overlay_deleted**
```json
{
  "id": "string"
}
```

**overlay_moved**
```json
{
  "id": "string",
  "position": { "x": 30, "y": 40 }
}
```

**overlay_resized**
```json
{
  "id": "string",
  "size": { "width": 250, "height": 60 }
}
```

---

## 🔧 Configuration

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
- MP4 direct playback: enabled

---

## 🐛 Troubleshooting

### FFmpeg Not Found
```
Error: FFmpeg is not installed
Solution: Install FFmpeg on your system (see installation section)
```

### RTSP Stream Not Starting
- Verify RTSP URL is correct and accessible
- Check if camera/source requires authentication
- Test RTSP URL with VLC Media Player first
- Increase FFmpeg timeout in `stream_manager.py`

### WebSocket Connection Failed
- Ensure backend is running on port 5000
- Check CORS configuration in `backend/app.py`
- Verify firewall allows WebSocket connections
- Check browser console for detailed errors

### MongoDB Connection Error
- Verify MongoDB is running locally
- Check connection string in `.env`
- For cloud MongoDB, verify IP whitelist
- Test connection with MongoDB Compass

### Overlay Not Appearing
- Ensure overlay content is not empty
- Check position is within video bounds (0-800, 0-450)
- Verify overlay size is > 0
- Refresh page and check browser console

### HLS Stream Errors
- Check backend server is running
- Verify stream URL is correct
- Try demo streams first to verify player works
- Check browser console for network errors

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=5001 python backend/app.py
```

---

## 🚢 Deployment

### Deploy Frontend to Vercel

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

2. **Deploy to Vercel:**
- Go to https://vercel.com/new
- Import your GitHub repository
- Configure:
  - Framework: Next.js
  - Build Command: `npm run build`
  - Output Directory: `.next`
- Add environment variable:
  ```
  NEXT_PUBLIC_API_URL=https://your-backend-url.com
  ```
- Click "Deploy"

### Deploy Backend to Railway.app

1. **Sign up at Railway.app**
2. **Create New Project** from GitHub repo
3. **Configure:**
   - Root Directory: `backend`
   - Start Command: `python app.py`
4. **Add Environment Variables:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   DATABASE_NAME=rtsp_overlay_db
   COLLECTION_NAME=overlays
   DEBUG=False
   PORT=5000
   ```
5. **Generate Domain** and update Vercel's `NEXT_PUBLIC_API_URL`

### MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Get connection string
4. Whitelist IP: `0.0.0.0/0`
5. Add to backend environment variables

---

## 📁 Project Structure

```
rtsp-overlay-app/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── backend/               # Flask backend
│   ├── app.py            # Main Flask app
│   ├── routes.py         # Overlay API routes
│   ├── stream_routes.py  # Stream API routes
│   ├── models.py         # Database models
│   ├── config.py         # Configuration
│   ├── stream_manager.py # FFmpeg stream manager
│   ├── socketio_manager.py # WebSocket manager
│   └── requirements.txt  # Python dependencies
├── components/           # React components
│   ├── video-player.tsx
│   ├── overlay-canvas.tsx
│   ├── overlay-manager.tsx
│   ├── stream-list.tsx
│   └── rtsp-stream-manager.tsx
├── hooks/               # Custom React hooks
│   └── use-websocket-overlay.ts
├── lib/                 # Utility functions
├── public/             # Static assets
├── BigBuckBunny.mp4   # Demo video file
├── Demovideo.mp4      # Application demo video
├── package.json       # Node dependencies
├── tsconfig.json      # TypeScript config
├── tailwind.config.ts # Tailwind config
├── next.config.mjs    # Next.js config
└── README.md          # This file
```

---

## 🎓 Assignment Requirements Checklist

### ✅ Core Features
- [x] RTSP stream playback
- [x] Overlay management (CRUD operations)
- [x] Real-time overlay synchronization
- [x] Drag-and-drop overlay positioning
- [x] Overlay resizing

### ✅ Technology Stack
- [x] Backend: Python (Flask)
- [x] Database: MongoDB
- [x] Frontend: React (Next.js)
- [x] Video Streaming: RTSP-compatible (FFmpeg + HLS.js)

### ✅ CRUD Operations
- [x] Create overlay
- [x] Read overlays (all and by ID)
- [x] Update overlay
- [x] Delete overlay

### ✅ Deliverables
- [x] Code Repository (Backend + Frontend)
- [x] Clear project structure
- [x] README with setup instructions
- [x] Instructions to run locally
- [x] RTSP URL configuration guide
- [x] API documentation with examples
- [x] User guide for overlay management
- [x] Demo video showing all features

---

## 🎬 Demo Video Content

The included `Demovideo.mp4` demonstrates:

1. **Starting the Application**
   - Backend server startup
   - Frontend server startup
   - Application loading

2. **Playing RTSP Livestream**
   - Loading demo stream
   - Video playback controls
   - Stream status indicators

3. **Creating Overlays**
   - Adding text overlay
   - Adding image overlay
   - Setting position and size

4. **Updating Overlays**
   - Editing overlay properties
   - Modifying content
   - Changing position/size

5. **Deleting Overlays**
   - Removing overlays
   - Confirmation of deletion

6. **Real-time Behavior**
   - Drag-and-drop positioning
   - Overlay resizing
   - Multi-client synchronization
   - WebSocket connection status

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open pull request

---

## 📧 Support

For issues and questions:
- Check the Troubleshooting section above
- Review browser console for errors (F12)
- Check backend logs for detailed error messages
- Verify all prerequisites are installed
- Test with demo streams first

---

## 🎯 Key Features Summary

- ✅ RTSP to HLS conversion with FFmpeg
- ✅ Real-time WebSocket synchronization
- ✅ Drag-and-drop overlay management
- ✅ MongoDB persistent storage
- ✅ Multi-client support
- ✅ Responsive UI with Tailwind CSS
- ✅ Complete REST API
- ✅ MP4 and HLS stream support
- ✅ Production-ready architecture
- ✅ Comprehensive documentation

---

**Built with ❤️ for RTSP livestream overlay management**
