"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"

interface Overlay {
  _id: string
  type: "text" | "image"
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface OverlayCanvasProps {
  overlays: Overlay[]
  videoWidth: number
  videoHeight: number
  onOverlayMove?: (id: string, position: { x: number; y: number }) => void
  onOverlayResize?: (id: string, size: { width: number; height: number }) => void
}

export default function OverlayCanvas({
  overlays,
  videoWidth,
  videoHeight,
  onOverlayMove,
  onOverlayResize,
}: OverlayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0)"
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw overlays
    overlays.forEach((overlay) => {
      const isSelected = overlay._id === selectedId

      if (overlay.type === "text") {
        ctx.font = "16px Arial"
        ctx.fillStyle = isSelected ? "rgba(59, 130, 246, 0.8)" : "rgba(255, 255, 255, 0.8)"
        ctx.fillRect(overlay.position.x, overlay.position.y, overlay.size.width, overlay.size.height)

        ctx.fillStyle = "white"
        ctx.textBaseline = "top"
        ctx.fillText(overlay.content, overlay.position.x + 5, overlay.position.y + 5)
      } else {
        // Image overlay placeholder
        ctx.fillStyle = isSelected ? "rgba(59, 130, 246, 0.6)" : "rgba(59, 130, 246, 0.3)"
        ctx.fillRect(overlay.position.x, overlay.position.y, overlay.size.width, overlay.size.height)

        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = "12px Arial"
        ctx.fillText("Image", overlay.position.x + overlay.size.width / 2, overlay.position.y + overlay.size.height / 2)
      }

      // Draw selection border
      if (isSelected) {
        ctx.strokeStyle = "rgb(59, 130, 246)"
        ctx.lineWidth = 2
        ctx.strokeRect(overlay.position.x, overlay.position.y, overlay.size.width, overlay.size.height)

        // Draw resize handle
        const handleSize = 8
        ctx.fillStyle = "rgb(59, 130, 246)"
        ctx.fillRect(
          overlay.position.x + overlay.size.width - handleSize,
          overlay.position.y + overlay.size.height - handleSize,
          handleSize,
          handleSize,
        )
      }
    })
  }, [overlays, selectedId])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicking on an overlay
    for (const overlay of overlays) {
      const isInOverlay =
        x >= overlay.position.x &&
        x <= overlay.position.x + overlay.size.width &&
        y >= overlay.position.y &&
        y <= overlay.position.y + overlay.size.height

      if (isInOverlay) {
        setSelectedId(overlay._id)

        // Check if clicking on resize handle
        const handleSize = 8
        const isResizeHandle =
          x >= overlay.position.x + overlay.size.width - handleSize &&
          y >= overlay.position.y + overlay.size.height - handleSize

        if (isResizeHandle) {
          setResizing(true)
        } else {
          setDragging(true)
          setDragOffset({
            x: x - overlay.position.x,
            y: y - overlay.position.y,
          })
        }
        return
      }
    }

    setSelectedId(null)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !selectedId) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const overlay = overlays.find((o) => o._id === selectedId)
    if (!overlay) return

    if (dragging) {
      const newX = Math.max(0, Math.min(x - dragOffset.x, canvas.width - overlay.size.width))
      const newY = Math.max(0, Math.min(y - dragOffset.y, canvas.height - overlay.size.height))

      onOverlayMove?.(selectedId, { x: newX, y: newY })
    } else if (resizing) {
      const newWidth = Math.max(50, x - overlay.position.x)
      const newHeight = Math.max(30, y - overlay.position.y)

      onOverlayResize?.(selectedId, { width: newWidth, height: newHeight })
    }
  }

  const handleMouseUp = () => {
    setDragging(false)
    setResizing(false)
  }

  return (
    <canvas
      ref={canvasRef}
      width={videoWidth}
      height={videoHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="absolute inset-0 cursor-move"
      style={{ display: overlays.length > 0 ? "block" : "none" }}
    />
  )
}
