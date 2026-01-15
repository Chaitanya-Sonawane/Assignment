import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
import './VideoPlayer.css';

const VideoPlayer = ({ rtspUrl, isPlaying }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  // Convert RTSP to HLS URL (this would typically be handled by your backend)
  const getStreamUrl = (rtspUrl) => {
    if (!rtspUrl) return '';
    
    // If it's already an HLS URL, use it directly
    if (rtspUrl.includes('.m3u8') || rtspUrl.includes('http')) {
      return rtspUrl;
    }
    
    // For RTSP URLs, you'd convert them via backend
    // For now, return empty to show placeholder
    return '';
  };

  const streamUrl = getStreamUrl(rtspUrl);

  return (
    <div className="video-player-container" ref={containerRef}>
      <div className="video-wrapper">
        {streamUrl ? (
          <ReactPlayer
            key={streamUrl}
            ref={playerRef}
            url={streamUrl}
            playing={isPlaying}
            controls={true}
            width="100%"
            height="100%"
            onError={(error) => {
              console.error('Video player error:', error);
            }}
            onReady={() => {
              console.log('Video player ready');
            }}
            config={{
              file: {
                attributes: {
                  crossOrigin: 'anonymous',
                },
                forceVideo: true,
              },
            }}
          />
        ) : (
          <div className="video-placeholder">
            <p>
              {!rtspUrl 
                ? 'Enter an HLS URL to start streaming' 
                : 'Click Play to start the stream'
              }
            </p>
            <p style={{ fontSize: '0.9rem', marginTop: '10px', color: '#ddd' }}>
              Try: https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
            </p>
          </div>
        )}
      </div>

      {/* Stream Info */}
      {streamUrl && (
        <div className="stream-info">
          <p>Stream: {rtspUrl}</p>
          <p>Status: {isPlaying ? 'Playing' : 'Stopped'}</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
