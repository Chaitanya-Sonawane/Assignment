"""
API routes for RTSP stream management
"""

from flask import Blueprint, request, jsonify
from stream_manager import stream_manager
import logging

stream_api = Blueprint('stream_api', __name__)

@stream_api.route('/streams', methods=['POST'])
def start_stream():
    """Start a new RTSP to HLS stream"""
    try:
        data = request.get_json()
        
        if not data or 'rtsp_url' not in data:
            return jsonify({'error': 'rtsp_url is required'}), 400
        
        rtsp_url = data['rtsp_url']
        stream_id = data.get('stream_id', 'default')
        
        # Validate RTSP URL
        if not rtsp_url.startswith('rtsp://'):
            return jsonify({'error': 'Invalid RTSP URL. Must start with rtsp://'}), 400
        
        # Start the stream
        stream_info = stream_manager.start_stream(stream_id, rtsp_url)
        
        return jsonify({
            'message': 'Stream started successfully',
            'stream': stream_info
        }), 201
        
    except Exception as e:
        logging.error(f"Error starting stream: {e}")
        return jsonify({'error': str(e)}), 500

@stream_api.route('/streams', methods=['GET'])
def list_streams():
    """List all active streams"""
    try:
        streams = stream_manager.list_streams()
        return jsonify({'streams': streams}), 200
    except Exception as e:
        logging.error(f"Error listing streams: {e}")
        return jsonify({'error': str(e)}), 500

@stream_api.route('/streams/<stream_id>', methods=['GET'])
def get_stream(stream_id):
    """Get information about a specific stream"""
    try:
        stream_info = stream_manager.get_stream_info(stream_id)
        
        if not stream_info:
            return jsonify({'error': 'Stream not found'}), 404
        
        return jsonify({'stream': stream_info}), 200
    except Exception as e:
        logging.error(f"Error getting stream info: {e}")
        return jsonify({'error': str(e)}), 500

@stream_api.route('/streams/<stream_id>', methods=['DELETE'])
def stop_stream(stream_id):
    """Stop a running stream"""
    try:
        success = stream_manager.stop_stream(stream_id)
        
        if not success:
            return jsonify({'error': 'Stream not found or already stopped'}), 404
        
        return jsonify({'message': 'Stream stopped successfully'}), 200
    except Exception as e:
        logging.error(f"Error stopping stream: {e}")
        return jsonify({'error': str(e)}), 500

@stream_api.route('/streams/stop-all', methods=['POST'])
def stop_all_streams():
    """Stop all running streams"""
    try:
        stream_manager.stop_all_streams()
        return jsonify({'message': 'All streams stopped'}), 200
    except Exception as e:
        logging.error(f"Error stopping all streams: {e}")
        return jsonify({'error': str(e)}), 500
