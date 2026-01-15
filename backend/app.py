from flask import Flask
from flask_cors import CORS
from routes import api
from stream_routes import stream_api
from socketio_manager import socketio
from config import Config
import logging
import os
from stream_manager import stream_manager
import atexit

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Enable CORS for all routes
    CORS(app, origins=['http://localhost:3000'])
    
    # Initialize SocketIO with app
    socketio.init_app(app, cors_allowed_origins="*")
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(stream_api, url_prefix='/api')
    
    # Serve HLS files
    @app.route('/hls/<path:filename>')
    def serve_hls(filename):
        """Serve HLS files"""
        from flask import send_from_directory
        hls_dir = os.path.join(os.getcwd(), 'hls')
        response = send_from_directory(hls_dir, filename)
        # Add CORS headers for HLS files
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        return response
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        from models import Database
        db = Database()
        db_status = "connected" if db.is_connected() else "disconnected (using in-memory storage)"
        
        # Check FFmpeg availability
        import subprocess
        try:
            subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
            ffmpeg_status = "installed"
        except:
            ffmpeg_status = "not installed"
        
        return {
            'status': 'healthy', 
            'message': 'RTSP Overlay API is running',
            'database': db_status,
            'ffmpeg': ffmpeg_status,
            'active_streams': len(stream_manager.list_streams()),
            'websocket': 'enabled'
        }, 200
    
    # Cleanup streams on shutdown
    @atexit.register
    def cleanup():
        logging.info("Shutting down - stopping all streams")
        stream_manager.stop_all_streams()
    
    return app

if __name__ == '__main__':
    app = create_app()
    # Use socketio.run instead of app.run for WebSocket support
    socketio.run(
        app,
        debug=Config.DEBUG,
        host='0.0.0.0',
        port=Config.PORT,
        allow_unsafe_werkzeug=True  # For development only
    )
