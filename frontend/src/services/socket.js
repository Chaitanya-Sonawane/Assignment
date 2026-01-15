import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
    });

    this.socket.on('connection_response', (data) => {
      console.log('Connection response:', data);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Emit events
  emitOverlayCreated(overlay) {
    if (this.socket) {
      this.socket.emit('overlay_created', overlay);
    }
  }

  emitOverlayUpdated(overlay) {
    if (this.socket) {
      this.socket.emit('overlay_updated', overlay);
    }
  }

  emitOverlayDeleted(overlayId) {
    if (this.socket) {
      this.socket.emit('overlay_deleted', { id: overlayId });
    }
  }

  emitOverlayMoved(overlayId, position) {
    if (this.socket) {
      this.socket.emit('overlay_moved', { id: overlayId, position });
    }
  }

  emitOverlayResized(overlayId, size) {
    if (this.socket) {
      this.socket.emit('overlay_resized', { id: overlayId, size });
    }
  }

  // Listen to events
  onOverlayCreated(callback) {
    if (this.socket) {
      this.socket.on('overlay_created', callback);
    }
  }

  onOverlayUpdated(callback) {
    if (this.socket) {
      this.socket.on('overlay_updated', callback);
    }
  }

  onOverlayDeleted(callback) {
    if (this.socket) {
      this.socket.on('overlay_deleted', callback);
    }
  }

  onOverlayMoved(callback) {
    if (this.socket) {
      this.socket.on('overlay_moved', callback);
    }
  }

  onOverlayResized(callback) {
    if (this.socket) {
      this.socket.on('overlay_resized', callback);
    }
  }
}

export default new SocketService();
