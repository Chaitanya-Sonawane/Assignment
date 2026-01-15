# User Guide

## Getting Started

### First Time Setup
1. Open browser to `http://localhost:3000`
2. You should see the RTSP Overlay Stream application
3. A demo video will load automatically

### Main Interface
- **Left side**: Video player with overlays
- **Right sidebar**: Stream management, RTSP controls, overlay tools

## Playing Videos

### Demo Streams
1. Look for "Load Stream" section
2. Click "Load Demo Stream"
3. Video plays immediately

### Custom HLS Stream
1. Copy your HLS URL
2. Paste in "Load Custom URL" field
3. Click "Load Custom URL"
4. Video loads and plays

### RTSP Stream
1. Scroll to "RTSP Streams" section
2. Click "Add RTSP Stream"
3. Enter Stream ID (e.g., "camera_1")
4. Enter RTSP URL (ask your camera/system admin for this)
5. Click "Start Stream"
6. Wait 10-30 seconds for conversion
7. Click "Copy HLS URL"
8. Paste in "Load Custom URL"

## Video Controls

### Playback
- **Play/Pause**: Click play button
- **Seek**: Click on progress bar or drag slider
- **Volume**: Use volume slider on right

### Display
- **Fullscreen**: Click fullscreen icon

### Status
- Current time and duration shown
- Green dot shows stream is ready

## Working with Overlays

### Create Text Overlay
1. Scroll to "Overlays" section
2. Click "Add Overlay"
3. Type appears selected
4. Enter your text (e.g., "LIVE")
5. Position: X and Y coordinates from top-left
6. Size: Width and height in pixels
   - Text: 200x50 is good starting size
7. Click "Create"

### Create Image Overlay
1. Click "Add Overlay"
2. Select "Image" type
3. Paste image URL (logo, watermark, etc.)
4. Set position and size
5. Click "Create"

### Move Overlay
1. Click on overlay in video
2. Cursor changes to crosshair
3. Drag to new location
4. All connected users see it move in real-time

### Resize Overlay
1. Click on overlay
2. Drag the square handle in bottom-right corner
3. Resize as needed
4. Real-time sync across all users

### Edit Overlay
1. Find overlay in list
2. Click pencil icon
3. Modify properties
4. Click "Update"

### Delete Overlay
1. Find overlay in list
2. Click trash icon
3. Overlay removed instantly

## Real-Time Collaboration

### Multiple Users
- Open app in multiple browser windows
- Create/move overlays in one window
- Other windows update automatically
- WebSocket indicator shows connection

### Connection Status
- Green dot in header: Connected
- Red dot: Disconnected (will reconnect)

## Tips & Tricks

### RTSP Stream Tips
- Verify RTSP URL before starting
- Common formats:
  - Hikvision: `rtsp://ip/stream1` or `rtsp://ip:554/h264/ch1/main/av_stream`
  - Dahua: `rtsp://ip/cam/realmonitor?channel=1`
  - Generic: `rtsp://ip:554/stream`

- If stream doesn't start, try with port 554:
  - `rtsp://ip:554/stream`

- Test RTSP URL first with VLC Media Player

### Overlay Positioning
- Top-left is (0, 0)
- Coordinates increase right and down
- Use small offset from edges (10, 10)

### Performance
- Limit overlays to 5-10 for smooth performance
- Larger overlays use more resources
- Video quality affects overall performance

### Best Practices
- Give streams meaningful IDs (camera_1, entryway, etc.)
- Use readable text sizes (height 40+)
- Position overlays where they don't block important content
- Test overlays on different screen sizes

## Troubleshooting

### Video Not Loading
- Check stream URL is correct
- Try demo stream first
- Check browser console for errors (F12)

### RTSP Stream Failed
- Verify camera/source is accessible
- Check URL format (must start with rtsp://)
- Test with VLC Media Player first
- Some cameras need authentication in URL:
  - `rtsp://user:password@ip/stream`

### Overlay Not Showing
- Ensure text/URL is not empty
- Check position is visible (0-800, 0-450)
- Try creating at position (10, 10) first
- Refresh page and try again

### Choppy Video
- Reduce bitrate in camera settings
- Close other applications
- Check internet connection
- Reduce overlay count

### Real-Time Sync Not Working
- Check WebSocket indicator (should be green)
- Verify backend is running
- Check browser console for errors
- Refresh page to reconnect

### Audio Issues
- Check system volume
- Check video player volume slider
- Some HLS streams may not have audio

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play/Pause |
| F | Fullscreen |
| → | Skip forward 5 seconds |
| ← | Skip backward 5 seconds |
| ↑ | Increase volume |
| ↓ | Decrease volume |

## Getting Help

If you encounter issues:
1. Check the Troubleshooting section above
2. Review error messages in browser console
3. Verify backend and frontend are both running
4. Check that MongoDB is connected
5. For RTSP issues, test URL in VLC first
