"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface StreamListProps {
  hlsUrl: string
  onLoadDemo: (stream: string) => void
  onCustomUrl: (e: React.FormEvent) => void
  customUrl: string
  onCustomUrlChange: (url: string) => void
  streamError: string | null
  demoStreams?: Record<string, string>
}

export default function StreamList({
  hlsUrl,
  onLoadDemo,
  onCustomUrl,
  customUrl,
  onCustomUrlChange,
  streamError,
  demoStreams = {},
}: StreamListProps) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsActive(!!hlsUrl)
  }, [hlsUrl])

  return (
    <div className="space-y-4">
      {/* Load Stream */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Load Stream
        </h3>
        <div className="space-y-3">
          {/* Custom URL Form */}
          <div className="space-y-2">
            <form onSubmit={onCustomUrl} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">HLS Stream URL</label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => onCustomUrlChange(e.target.value)}
                  placeholder="https://example.com/stream.m3u8"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                Load Stream
              </button>
            </form>
          </div>

          {streamError && (
            <div className="p-3 bg-red-900/20 border border-red-600/50 rounded-xl text-red-400 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {streamError}
            </div>
          )}
        </div>
      </div>

      {/* Stream Info Card */}
      <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4 backdrop-blur">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Current Stream</h3>
        <div className="space-y-3">
          {hlsUrl ? (
            <>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2">Stream URL</p>
                <p className="text-xs text-slate-200 break-all font-mono bg-slate-950/50 p-3 rounded-lg border border-slate-800">{hlsUrl}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/50 rounded-lg border border-slate-800">
                <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" : "bg-amber-500 animate-pulse"}`} />
                <p className="text-sm font-medium text-slate-300">{isActive ? "Stream Active" : "Loading..."}</p>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-slate-500 text-sm">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              No stream loaded
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
