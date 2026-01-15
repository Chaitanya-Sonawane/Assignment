"""
WebSocket manager for real-time overlay updates
"""

from flask_socketio import SocketIO, emit
import logging

# Initialize SocketIO
socketio = SocketIO(cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    logging.info("Client connected")
    emit('connection_response', {'status': 'connected'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logging.info("Client disconnected")

@socketio.on('overlay_created')
def handle_overlay_created(data):
    """Broadcast overlay creation to all clients"""
    logging.info(f"Overlay created: {data.get('id', 'unknown')}")
    emit('overlay_created', data, broadcast=True, include_self=False)

@socketio.on('overlay_updated')
def handle_overlay_updated(data):
    """Broadcast overlay update to all clients"""
    logging.info(f"Overlay updated: {data.get('id', 'unknown')}")
    emit('overlay_updated', data, broadcast=True, include_self=False)

@socketio.on('overlay_deleted')
def handle_overlay_deleted(data):
    """Broadcast overlay deletion to all clients"""
    logging.info(f"Overlay deleted: {data.get('id', 'unknown')}")
    emit('overlay_deleted', data, broadcast=True, include_self=False)

@socketio.on('overlay_moved')
def handle_overlay_moved(data):
    """Broadcast overlay movement to all clients (real-time)"""
    emit('overlay_moved', data, broadcast=True, include_self=False)

@socketio.on('overlay_resized')
def handle_overlay_resized(data):
    """Broadcast overlay resize to all clients (real-time)"""
    emit('overlay_resized', data, broadcast=True, include_self=False)
