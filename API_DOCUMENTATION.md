# API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
Currently no authentication. Use Bearer tokens in production.

## Response Format

### Success Response
```json
{
  "data": { },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

## Overlay Endpoints

### POST /api/overlays
Create a new overlay

**Request Body**
```json
{
  "type": "text|image",
  "content": "string",
  "position": {
    "x": number,
    "y": number
  },
  "size": {
    "width": number,
    "height": number
  }
}
```

**Response** (201 Created)
```json
{
  "message": "Overlay created successfully",
  "id": "507f1f77bcf86cd799439011"
}
```

**Errors**
- 400: Validation error
- 500: Server error

---

### GET /api/overlays
Get all overlays

**Response** (200 OK)
```json
{
  "overlays": [
    {
      "_id": "string",
      "type": "text|image",
      "content": "string",
      "position": { "x": number, "y": number },
      "size": { "width": number, "height": number }
    }
  ]
}
```

---

### GET /api/overlays/{id}
Get single overlay

**Response** (200 OK)
```json
{
  "overlay": { }
}
```

**Errors**
- 400: Invalid ID format
- 404: Overlay not found

---

### PUT /api/overlays/{id}
Update overlay (partial update supported)

**Request Body**
```json
{
  "position": { "x": number, "y": number },
  "size": { "width": number, "height": number },
  "content": "string"
}
```

**Response** (200 OK)
```json
{
  "message": "Overlay updated successfully"
}
```

**Errors**
- 400: Invalid ID or validation error
- 404: Overlay not found
- 500: Server error

---

### DELETE /api/overlays/{id}
Delete overlay

**Response** (200 OK)
```json
{
  "message": "Overlay deleted successfully"
}
```

**Errors**
- 400: Invalid ID format
- 404: Overlay not found

## Stream Endpoints

### POST /api/streams
Start RTSP to HLS stream

**Request Body**
```json
{
  "stream_id": "string",
  "rtsp_url": "rtsp://..."
}
```

**Response** (201 Created)
```json
{
  "message": "Stream started successfully",
  "stream": {
    "stream_id": "string",
    "rtsp_url": "rtsp://...",
    "hls_url": "/hls/stream.m3u8",
    "status": "running|stopped",
    "pid": number
  }
}
```

---

### GET /api/streams
List active streams

**Response** (200 OK)
```json
{
  "streams": [ ]
}
```

---

### GET /api/streams/{stream_id}
Get stream information

**Response** (200 OK)
```json
{
  "stream": { }
}
```

---

### DELETE /api/streams/{stream_id}
Stop stream

**Response** (200 OK)
```json
{
  "message": "Stream stopped successfully"
}
```

---

### POST /api/streams/stop-all
Stop all streams

**Response** (200 OK)
```json
{
  "message": "All streams stopped"
}
```

## WebSocket Events

Connect to `http://localhost:5000` with Socket.IO client

### Server → Client Events

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
  "position": { "x": number, "y": number },
  "size": { "width": number, "height": number }
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
  "position": { "x": number, "y": number }
}
```

**overlay_resized**
```json
{
  "id": "string",
  "size": { "width": number, "height": number }
}
```

### Client → Server Events

**overlay_created** - Broadcast to other clients
```json
{
  "_id": "string",
  "type": "text|image",
  "content": "string",
  "position": { "x": number, "y": number },
  "size": { "width": number, "height": number }
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
  "position": { "x": number, "y": number }
}
```

**overlay_resized**
```json
{
  "id": "string",
  "size": { "width": number, "height": number }
}
