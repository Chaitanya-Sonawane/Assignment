import React, { useState } from 'react';
import VideoPlayer from './components/VideoPlayer';
import './App.css';

function App() {
  const [rtspUrl, setRtspUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <h1>RTSP Overlay Management</h1>
        
        {/* RTSP URL Input */}
        <div className="rtsp-controls">
          <input
            type="text"
            placeholder="Enter HLS URL (e.g., https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8)"
            value={rtspUrl}
            onChange={(e) => setRtspUrl(e.target.value)}
            className="rtsp-input"
          />
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!rtspUrl}
            className="play-button"
          >
            {isPlaying ? 'Stop' : 'Play'}
          </button>
        </div>
      </header>

      <main className="App-main">
        <div className="video-section">
          <VideoPlayer rtspUrl={rtspUrl} isPlaying={isPlaying} />
        </div>
      </main>
    </div>
  );
}

export default App;
