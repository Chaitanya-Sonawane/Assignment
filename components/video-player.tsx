"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import HLS from "hls.js"

interface VideoPlayerProps {
  src: string
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!videoRef.current || !src) return

    const video = videoRef.current
    let hls: HLS | null = null

    setIsLoading(true)
    setError(null)

    // Check if it's a direct MP4 file
    const isMp4 = src.endsWith('.mp4') || src.endsWith('.MP4')
    
    if (isMp4) {
      // Handle direct MP4 playback
      video.src = src
      setIsLoading(false)
      video.play().catch((err) => {
        console.log("[v0] Autoplay prevented:", err)
      })
    } else if (HLS.isSupported()) {
      hls = new HLS({
        debug: false,
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.1,
        nudgeMaxRetry: 3,
        xhrSetup: (xhr, url) => {
          xhr.withCredentials = false
          xhr.timeout = 10000
        },
        fragLoadPolicy: {
          default: {
            maxTimeToFirstByteMs: 10000,
            maxLoadTimeMs: 20000,
            timeoutRetry: { maxNumRetry: 3, retryDelayMs: 1000 },
            errorRetry: { maxNumRetry: 3, retryDelayMs: 1000 },
          },
        },
      })

      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(HLS.Events.MANIFEST_PARSED, () => {
        console.log("[v0] HLS manifest parsed successfully")
        setIsLoading(false)
        video.play().catch((err) => {
          console.log("[v0] Autoplay prevented:", err)
        })
      })

      hls.on(HLS.Events.ERROR, (event, data) => {
        // Only log fatal errors or important warnings
        if (data.fatal) {
          console.error("[v0] Fatal HLS error:", data)
        } else if (data.details !== 'bufferStalledError' && data.details !== 'bufferNudgeOnStall') {
          console.warn("[v0] HLS warning:", data.details)
        }
        
        setIsLoading(false)
        
        if (data.fatal) {
          switch (data.type) {
            case HLS.ErrorTypes.NETWORK_ERROR:
              console.error("[v0] Network error details:", {
                url: data.url,
                response: data.response,
                details: data.details
              })
              if (data.response?.code === 404) {
                setError("Stream not found (404). Make sure the backend is running and the stream has been started.")
              } else if (data.response?.code === 0 || !data.response) {
                setError("Cannot connect to stream. Check that the backend server is running at the correct URL.")
              } else {
                setError(`Network error: Unable to load stream. ${data.details || 'Please check the URL.'}`)
              }
              // Try to recover from network errors
              hls.startLoad()
              break
            case HLS.ErrorTypes.MEDIA_ERROR:
              console.error("[v0] Media error, attempting recovery...")
              setError("Media error detected, attempting to recover...")
              // Try to recover from media errors
              hls.recoverMediaError()
              // Clear error after a moment if recovery works
              setTimeout(() => {
                if (hls && video && !video.paused) {
                  setError(null)
                }
              }, 2000)
              break
            default:
              setError(`Stream error: ${data.details}`)
          }
        }
      })
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src
      setIsLoading(false)
    } else {
      setError("HLS streaming is not supported on this device")
      setIsLoading(false)
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [src])

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "00:00"
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = String(date.getUTCSeconds()).padStart(2, "0")
    if (hh) {
      return `${hh}:${String(mm).padStart(2, "0")}:${ss}`
    }
    return `${mm}:${ss}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number.parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  return (
    <div className="space-y-4">
      {/* Video Element */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          className="h-full w-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={handlePause}
          crossOrigin="anonymous"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-300">Loading stream...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center p-4">
              <p className="text-red-400 font-semibold">{error}</p>
              <p className="text-slate-400 text-sm mt-2">Try loading a different stream URL from the sidebar.</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-slate-900/50 rounded-lg p-4 space-y-4 border border-slate-700">
        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex-1 text-sm text-slate-400">
            {duration ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "Loading..."}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="70"
              onChange={(e) => {
                if (videoRef.current) {
                  videoRef.current.volume = Number.parseInt(e.target.value) / 100
                }
              }}
              className="w-16 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              aria-label="Volume"
            />
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => {
              if (videoRef.current?.requestFullscreen) {
                videoRef.current.requestFullscreen()
              }
            }}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Fullscreen"
          >
            <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
