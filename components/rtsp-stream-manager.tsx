"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Stamp as Stop, Plus, AlertCircle, Info, RefreshCw } from "lucide-react"
import { startStream, stopStream, listStreams, checkHealth, type Stream } from "@/lib/api"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function RTSPStreamManager() {
  const [streams, setStreams] = useState<Stream[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [backendConnected, setBackendConnected] = useState(false)
  const [formData, setFormData] = useState({
    stream_id: "",
    rtsp_url: "",
  })

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection()
    loadStreams()
  }, [])

  const checkBackendConnection = async () => {
    const isConnected = await checkHealth()
    setBackendConnected(isConnected)
  }

  const loadStreams = async () => {
    const result = await listStreams()
    if (result.data) {
      setStreams(result.data)
    }
  }

  const handleStartStream = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.stream_id.trim() || !formData.rtsp_url.trim()) {
      setError("Both Stream ID and RTSP URL are required")
      return
    }

    if (!formData.rtsp_url.startsWith("rtsp://")) {
      setError("RTSP URL must start with rtsp://")
      return
    }

    if (!backendConnected) {
      setError("Backend server is not running. Start the Flask backend: python backend/app.py")
      return
    }

    setLoading(true)
    const result = await startStream(formData)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setStreams([...streams, result.data])
      setFormData({ stream_id: "", rtsp_url: "" })
      setShowForm(false)
    }
  }

  const handleStopStream = async (streamId: string) => {
    if (!backendConnected) {
      setError("Backend server is not running")
      return
    }

    setLoading(true)
    const result = await stopStream(streamId)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setStreams(streams.filter(s => s.stream_id !== streamId))
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          RTSP Streams
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              checkBackendConnection()
              loadStreams()
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm font-medium rounded-lg transition-all disabled:opacity-50 border border-slate-700"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={!backendConnected || loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:bg-slate-600 shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Stream
          </button>
        </div>
      </div>

      {/* Backend Connection Status */}
      {!backendConnected && (
        <div className="p-4 bg-amber-900/20 border border-amber-600/50 rounded-xl text-amber-400 text-sm flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Backend Server Offline</p>
            <p className="text-xs text-amber-300/80">
              Start backend: <code className="bg-slate-950/50 px-2 py-1 rounded border border-amber-700/30">python backend/app.py</code>
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-600/50 rounded-xl text-red-400 text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && backendConnected && (
        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4 space-y-4">
          <h4 className="font-semibold text-white">Start RTSP Stream</h4>
          <form onSubmit={handleStartStream} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Stream ID</label>
              <input
                type="text"
                value={formData.stream_id}
                onChange={(e) => setFormData({ ...formData, stream_id: e.target.value })}
                placeholder="e.g., camera1"
                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">RTSP URL</label>
              <input
                type="text"
                value={formData.rtsp_url}
                onChange={(e) => setFormData({ ...formData, rtsp_url: e.target.value })}
                placeholder="rtsp://example.com/stream"
                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
              <p className="text-xs text-slate-400 mt-2">Must start with rtsp://</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
              >
                {loading ? 'Starting...' : 'Start Stream'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 text-white font-medium rounded-lg transition-all border border-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Streams List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {streams.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-sm">
            {backendConnected ? 'No active streams' : 'Backend offline'}
          </div>
        ) : (
          streams.map((stream) => (
            <div key={stream.stream_id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{stream.stream_id}</p>
                  <p className="text-xs text-slate-400 truncate">{stream.rtsp_url}</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${stream.status === 'running' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-slate-400">{stream.status}</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono truncate">
                HLS: {stream.hls_url}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${API_URL}${stream.hls_url}`)
                  }}
                  className="flex-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded transition-colors"
                >
                  Copy HLS URL
                </button>
                <button
                  onClick={() => handleStopStream(stream.stream_id)}
                  disabled={loading}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <Stop className="w-3 h-3" />
                  Stop
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Section */}
      <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3 text-xs text-slate-400">
        <div className="flex gap-2 items-start">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
          <div>
            <p className="font-medium text-slate-300 mb-1">Quick Guide:</p>
            <p>Add your RTSP camera URL, get HLS stream, paste in video player</p>
          </div>
        </div>
      </div>
    </div>
  )
}
