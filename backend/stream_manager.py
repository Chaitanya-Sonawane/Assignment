"""
RTSP to HLS Stream Manager
Handles FFmpeg processes for converting RTSP streams to HLS
"""

import subprocess
import os
import logging
import signal
from pathlib import Path

class StreamManager:
    def __init__(self, hls_output_dir='hls'):
        self.hls_output_dir = hls_output_dir
        self.active_streams = {}
        self._ensure_hls_directory()
    
    def _ensure_hls_directory(self):
        """Create HLS output directory if it doesn't exist"""
        Path(self.hls_output_dir).mkdir(parents=True, exist_ok=True)
        logging.info(f"HLS output directory: {os.path.abspath(self.hls_output_dir)}")
    
    def start_stream(self, stream_id, rtsp_url):
        """
        Start converting an RTSP stream to HLS
        
        Args:
            stream_id: Unique identifier for the stream
            rtsp_url: RTSP URL to convert
        
        Returns:
            dict: Stream information including HLS URL
        """
        if stream_id in self.active_streams:
            logging.warning(f"Stream {stream_id} is already running")
            return self.get_stream_info(stream_id)
        
        output_path = os.path.join(self.hls_output_dir, f"{stream_id}.m3u8")
        
        # FFmpeg command for RTSP to HLS conversion
        ffmpeg_cmd = [
            'ffmpeg',
            '-i', rtsp_url,
            '-c:v', 'libx264',           # Video codec
            '-c:a', 'aac',               # Audio codec
            '-f', 'hls',                 # Output format
            '-hls_time', '2',            # Segment duration (seconds)
            '-hls_list_size', '5',       # Number of segments in playlist
            '-hls_flags', 'delete_segments',  # Delete old segments
            '-hls_allow_cache', '0',     # Disable caching
            '-start_number', '0',        # Start segment numbering at 0
            '-y',                        # Overwrite output files
            output_path
        ]
        
        try:
            # Start FFmpeg process
            process = subprocess.Popen(
                ffmpeg_cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                preexec_fn=os.setsid  # Create new process group
            )
            
            self.active_streams[stream_id] = {
                'process': process,
                'rtsp_url': rtsp_url,
                'output_path': output_path,
                'hls_url': f'/hls/{stream_id}.m3u8'
            }
            
            logging.info(f"Started stream {stream_id}: {rtsp_url} -> {output_path}")
            return self.get_stream_info(stream_id)
            
        except FileNotFoundError:
            logging.error("FFmpeg not found. Please install FFmpeg.")
            raise Exception("FFmpeg is not installed. Install it with: sudo apt-get install ffmpeg")
        except Exception as e:
            logging.error(f"Failed to start stream {stream_id}: {e}")
            raise
    
    def stop_stream(self, stream_id):
        """Stop a running stream"""
        if stream_id not in self.active_streams:
            logging.warning(f"Stream {stream_id} is not running")
            return False
        
        stream_info = self.active_streams[stream_id]
        process = stream_info['process']
        
        try:
            # Send SIGTERM to process group
            os.killpg(os.getpgid(process.pid), signal.SIGTERM)
            process.wait(timeout=5)
            logging.info(f"Stopped stream {stream_id}")
        except subprocess.TimeoutExpired:
            # Force kill if it doesn't stop gracefully
            os.killpg(os.getpgid(process.pid), signal.SIGKILL)
            logging.warning(f"Force killed stream {stream_id}")
        except Exception as e:
            logging.error(f"Error stopping stream {stream_id}: {e}")
        
        # Clean up
        del self.active_streams[stream_id]
        
        # Remove HLS files
        self._cleanup_hls_files(stream_id)
        
        return True
    
    def _cleanup_hls_files(self, stream_id):
        """Remove HLS files for a stream"""
        try:
            import glob
            pattern = os.path.join(self.hls_output_dir, f"{stream_id}*")
            for file in glob.glob(pattern):
                os.remove(file)
                logging.debug(f"Removed {file}")
        except Exception as e:
            logging.error(f"Error cleaning up HLS files: {e}")
    
    def get_stream_info(self, stream_id):
        """Get information about a stream"""
        if stream_id not in self.active_streams:
            return None
        
        stream = self.active_streams[stream_id]
        process = stream['process']
        
        return {
            'stream_id': stream_id,
            'rtsp_url': stream['rtsp_url'],
            'hls_url': stream['hls_url'],
            'status': 'running' if process.poll() is None else 'stopped',
            'pid': process.pid
        }
    
    def list_streams(self):
        """List all active streams"""
        return [self.get_stream_info(sid) for sid in self.active_streams.keys()]
    
    def stop_all_streams(self):
        """Stop all running streams"""
        stream_ids = list(self.active_streams.keys())
        for stream_id in stream_ids:
            self.stop_stream(stream_id)
        logging.info("Stopped all streams")
    
    def is_stream_running(self, stream_id):
        """Check if a stream is running"""
        if stream_id not in self.active_streams:
            return False
        
        process = self.active_streams[stream_id]['process']
        return process.poll() is None

# Global stream manager instance
stream_manager = StreamManager()
