"use client"

import { useEffect, useRef, useCallback } from "react"
import { io, type Socket } from "socket.io-client"

interface Overlay {
  _id: string
  type: "text" | "image"
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
}

interface UseWebSocketOverlayProps {
  onOverlayCreated: (overlay: Overlay) => void
  onOverlayUpdated: (id: string, overlay: Overlay) => void
  onOverlayDeleted: (id: string) => void
  onOverlayMoved: (id: string, position: { x: number; y: number }) => void
  onOverlayResized: (id: string, size: { width: number; height: number }) => void
}

export function useWebSocketOverlay({
  onOverlayCreated,
  onOverlayUpdated,
  onOverlayDeleted,
  onOverlayMoved,
  onOverlayResized,
}: UseWebSocketOverlayProps) {
  const socketRef = useRef<Socket | null>(null)
  const connectedRef = useRef(false)

  // Initialize WebSocket connection
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("[v0] WebSocket connected")
      connectedRef.current = true
    })

    socket.on("disconnect", () => {
      console.log("[v0] WebSocket disconnected")
      connectedRef.current = false
    })

    socket.on("overlay_created", (data: Overlay) => {
      console.log("[v0] Overlay created via WebSocket:", data._id)
      onOverlayCreated(data)
    })

    socket.on("overlay_updated", (data: { id: string; overlay: Overlay }) => {
      console.log("[v0] Overlay updated via WebSocket:", data.id)
      onOverlayUpdated(data.id, data.overlay)
    })

    socket.on("overlay_deleted", (data: { id: string }) => {
      console.log("[v0] Overlay deleted via WebSocket:", data.id)
      onOverlayDeleted(data.id)
    })

    socket.on("overlay_moved", (data: { id: string; position: { x: number; y: number } }) => {
      console.log("[v0] Overlay moved via WebSocket:", data.id)
      onOverlayMoved(data.id, data.position)
    })

    socket.on("overlay_resized", (data: { id: string; size: { width: number; height: number } }) => {
      console.log("[v0] Overlay resized via WebSocket:", data.id)
      onOverlayResized(data.id, data.size)
    })

    socket.on("connection_response", (data) => {
      console.log("[v0] Connection response:", data)
    })

    return () => {
      socket.disconnect()
    }
  }, [onOverlayCreated, onOverlayUpdated, onOverlayDeleted, onOverlayMoved, onOverlayResized])

  // Emit events to other clients
  const emitOverlayCreated = useCallback((overlay: Overlay) => {
    if (connectedRef.current && socketRef.current) {
      socketRef.current.emit("overlay_created", overlay)
    }
  }, [])

  const emitOverlayUpdated = useCallback((id: string, overlay: Overlay) => {
    if (connectedRef.current && socketRef.current) {
      socketRef.current.emit("overlay_updated", { id, overlay })
    }
  }, [])

  const emitOverlayDeleted = useCallback((id: string) => {
    if (connectedRef.current && socketRef.current) {
      socketRef.current.emit("overlay_deleted", { id })
    }
  }, [])

  const emitOverlayMoved = useCallback((id: string, position: { x: number; y: number }) => {
    if (connectedRef.current && socketRef.current) {
      socketRef.current.emit("overlay_moved", { id, position })
    }
  }, [])

  const emitOverlayResized = useCallback((id: string, size: { width: number; height: number }) => {
    if (connectedRef.current && socketRef.current) {
      socketRef.current.emit("overlay_resized", { id, size })
    }
  }, [])

  return {
    isConnected: connectedRef.current,
    emitOverlayCreated,
    emitOverlayUpdated,
    emitOverlayDeleted,
    emitOverlayMoved,
    emitOverlayResized,
  }
}
