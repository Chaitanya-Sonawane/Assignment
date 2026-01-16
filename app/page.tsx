"use client"

import type React from "react"

import { useState, useEffect } from "react"
import VideoPlayer from "@/components/video-player"
import StreamList from "@/components/stream-list"
import OverlayManager from "@/components/overlay-manager"
import OverlayCanvas from "@/components/overlay-canvas"
import RTSPStreamManager from "@/components/rtsp-stream-manager"
import { useWebSocketOverlay } from "@/hooks/use-websocket-overlay"

const DEMO_STREAMS = {
  "Big Buck Bunny (Local)": "http://localhost:5000/demo/BigBuckBunny.mp4",
  "Big Buck Bunny": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "Apple Demo Stream": "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
  "Sintel Movie": "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
  "Tears of Steel": "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
}

interface Overlay {
  _id: string
  type: "text" | "image"
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export default function Home() {
  const [selectedStream, setSelectedStream] = useState<string>("")
  const [hlsUrl, setHlsUrl] = useState<string>("")
  const [customUrl, setCustomUrl] = useState<string>("")
  const [streamError, setStreamError] = useState<string | null>(null)
  const [overlays, setOverlays] = useState<Overlay[]>([])

  const {
    isConnected,
    emitOverlayCreated,
    emitOverlayUpdated,
    emitOverlayDeleted,
    emitOverlayMoved,
    emitOverlayResized,
  } = useWebSocketOverlay({
    onOverlayCreated: (overlay) => setOverlays((prev) => [...prev, overlay]),
    onOverlayUpdated: (id, overlay) => setOverlays((prev) => prev.map((o) => (o._id === id ? overlay : o))),
    onOverlayDeleted: (id) => setOverlays((prev) => prev.filter((o) => o._id !== id)),
    onOverlayMoved: (id, position) => setOverlays((prev) => prev.map((o) => (o._id === id ? { ...o, position } : o))),
    onOverlayResized: (id, size) => setOverlays((prev) => prev.map((o) => (o._id === id ? { ...o, size } : o))),
  })

  useEffect(() => {
    const envUrl = process.env.NEXT_PUBLIC_HLS_STREAM_URL
    if (envUrl) {
      setHlsUrl(envUrl)
      setSelectedStream(envUrl)
    }
  }, [])

  const handleCustomUrl = (e: React.FormEvent) => {
    e.preventDefault()
    if (customUrl.trim()) {
      try {
        new URL(customUrl)
        setHlsUrl(customUrl)
        setSelectedStream(customUrl)
        setStreamError(null)
      } catch {
        setStreamError("Invalid URL. Please enter a valid HLS stream URL.")
      }
    }
  }

  const loadDemoStream = (stream: string) => {
    setHlsUrl(stream)
    setSelectedStream(stream)
    setCustomUrl("")
    setStreamError(null)
  }

  const handleOverlayAdd = (overlay: Overlay) => {
    setOverlays([...overlays, overlay])
    emitOverlayCreated(overlay)
  }

  const handleOverlayUpdate = (id: string, updatedOverlay: Overlay) => {
    setOverlays(overlays.map((o) => (o._id === id ? updatedOverlay : o)))
    emitOverlayUpdated(id, updatedOverlay)
  }

  const handleOverlayDelete = (id: string) => {
    setOverlays(overlays.filter((o) => o._id !== id))
    emitOverlayDeleted(id)
  }

  const handleOverlayMove = (id: string, position: { x: number; y: number }) => {
    setOverlays(overlays.map((o) => (o._id === id ? { ...o, position } : o)))
    emitOverlayMoved(id, position)
  }

  const handleOverlayResize = (id: string, size: { width: number; height: number }) => {
    setOverlays(overlays.map((o) => (o._id === id ? { ...o, size } : o)))
    emitOverlayResized(id, size)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      <header className="border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Stream Overlay Manager
                </h1>
                <p className="mt-0.5 text-sm text-slate-400">Professional live streaming with real-time overlays</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" : "bg-red-500"}`}></div>
              <p className="text-sm font-medium text-slate-300">{isConnected ? "Live" : "Offline"}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="group rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-950/90 to-slate-900/90 p-4 backdrop-blur-xl shadow-2xl hover:border-slate-700/50 transition-all duration-300">
              <div className="relative rounded-xl overflow-hidden bg-black/50 shadow-inner">
                <VideoPlayer src={hlsUrl} />
                <OverlayCanvas
                  overlays={overlays}
                  videoWidth={800}
                  videoHeight={450}
                  onOverlayMove={handleOverlayMove}
                  onOverlayResize={handleOverlayResize}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {/* Stream Sources */}
            <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-950/90 to-slate-900/90 p-5 backdrop-blur-xl shadow-xl hover:border-slate-700/50 transition-all duration-300">
              <StreamList
                hlsUrl={hlsUrl}
                onLoadDemo={loadDemoStream}
                onCustomUrl={handleCustomUrl}
                customUrl={customUrl}
                onCustomUrlChange={setCustomUrl}
                streamError={streamError}
                demoStreams={DEMO_STREAMS}
              />
            </div>

            {/* RTSP Stream Manager */}
            <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-950/90 to-slate-900/90 p-5 backdrop-blur-xl shadow-xl hover:border-slate-700/50 transition-all duration-300">
              <RTSPStreamManager />
            </div>

            {/* Overlay Manager */}
            <div className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-950/90 to-slate-900/90 p-5 backdrop-blur-xl shadow-xl hover:border-slate-700/50 transition-all duration-300">
              <OverlayManager
                onOverlayAdd={handleOverlayAdd}
                onOverlayUpdate={handleOverlayUpdate}
                onOverlayDelete={handleOverlayDelete}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
