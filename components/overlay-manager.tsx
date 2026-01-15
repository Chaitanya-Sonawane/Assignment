"use client"

import type React from "react"
import { useState } from "react"
import { Trash2, Edit2, Plus, X, AlertCircle } from "lucide-react"

interface Overlay {
  _id: string
  type: "text" | "image"
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface OverlayManagerProps {
  onOverlayAdd: (overlay: Overlay) => void
  onOverlayUpdate: (id: string, overlay: Overlay) => void
  onOverlayDelete: (id: string) => void
}

export default function OverlayManager({ onOverlayAdd, onOverlayUpdate, onOverlayDelete }: OverlayManagerProps) {
  const [overlays, setOverlays] = useState<Overlay[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [backendConnected] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    type: "text" as "text" | "image",
    content: "",
    position: { x: 10, y: 10 },
    size: { width: 200, height: 50 },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      setLoading(true)

      if (editingId) {
        // Update existing overlay
        const newOverlay = { ...formData, _id: editingId }
        setOverlays(overlays.map((o) => (o._id === editingId ? newOverlay : o)))
        onOverlayUpdate(editingId, newOverlay)
      } else {
        // Create new overlay with generated ID
        const newOverlay = { ...formData, _id: `overlay-${Date.now()}` }
        setOverlays([...overlays, newOverlay])
        onOverlayAdd(newOverlay)
      }

      resetForm()
    } catch (err) {
      console.error("Error saving overlay:", err)
      setError(err instanceof Error ? err.message : "Failed to save overlay")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    try {
      setLoading(true)
      setOverlays(overlays.filter((o) => o._id !== id))
      onOverlayDelete(id)
    } catch (err) {
      console.error("Error deleting overlay:", err)
      setError("Failed to delete overlay")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (overlay: Overlay) => {
    setFormData({
      type: overlay.type,
      content: overlay.content,
      position: overlay.position,
      size: overlay.size,
    })
    setEditingId(overlay._id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      type: "text",
      content: "",
      position: { x: 10, y: 10 },
      size: { width: 200, height: 50 },
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Overlays
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-600/50 rounded-xl text-red-400 text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white">{editingId ? "Edit Overlay" : "New Overlay"}</h4>
            <button onClick={resetForm} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border border-slate-700 bg-slate-950/50 hover:bg-slate-900/50 transition-all">
                  <input
                    type="radio"
                    value="text"
                    checked={formData.type === "text"}
                    onChange={() => setFormData({ ...formData, type: "text" })}
                    className="text-emerald-500"
                  />
                  <span className="text-sm text-slate-300">Text</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border border-slate-700 bg-slate-950/50 hover:bg-slate-900/50 transition-all">
                  <input
                    type="radio"
                    value="image"
                    checked={formData.type === "image"}
                    onChange={() => setFormData({ ...formData, type: "image" })}
                    className="text-emerald-500"
                  />
                  <span className="text-sm text-slate-300">Image</span>
                </label>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {formData.type === "text" ? "Text Content" : "Image URL"}
              </label>
              <input
                type={formData.type === "text" ? "text" : "url"}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={formData.type === "text" ? "Enter text..." : "https://example.com/image.png"}
                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                required
              />
            </div>

            {/* Position */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">X Position (px)</label>
                <input
                  type="number"
                  value={formData.position.x}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      position: { ...formData.position, x: Number(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Y Position (px)</label>
                <input
                  type="number"
                  value={formData.position.y}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      position: { ...formData.position, y: Number(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Width (px)</label>
                <input
                  type="number"
                  value={formData.size.width}
                  onChange={(e) =>
                    setFormData({ ...formData, size: { ...formData.size, width: Number(e.target.value) } })
                  }
                  min="1"
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Height (px)</label>
                <input
                  type="number"
                  value={formData.size.height}
                  onChange={(e) =>
                    setFormData({ ...formData, size: { ...formData.size, height: Number(e.target.value) } })
                  }
                  min="1"
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-600 disabled:to-slate-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-emerald-500/20"
              >
                {loading ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 text-white font-medium rounded-lg transition-all border border-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Overlay List */}
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {overlays.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            No overlays yet
          </div>
        ) : (
          overlays.map((overlay) => (
            <div
              key={overlay._id}
              className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-xl border border-slate-800/50 hover:border-slate-700/50 transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {overlay.type === "text" ? "📝" : "🖼️"} {overlay.content.substring(0, 30)}
                  {overlay.content.length > 30 ? "..." : ""}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Position: ({overlay.position.x}, {overlay.position.y}) | Size: {overlay.size.width}×
                  {overlay.size.height}
                </p>
              </div>
              <button
                onClick={() => handleEdit(overlay)}
                className="p-2 hover:bg-slate-800/50 rounded-lg transition-all text-slate-400 hover:text-emerald-400"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(overlay._id)}
                className="p-2 hover:bg-red-900/30 rounded-lg transition-all text-slate-400 hover:text-red-400"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
