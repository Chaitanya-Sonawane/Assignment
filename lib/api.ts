/**
 * API service for backend communication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface Stream {
  stream_id: string
  rtsp_url: string
  hls_url: string
  status: 'running' | 'stopped'
  pid: number
}

export interface StartStreamRequest {
  stream_id: string
  rtsp_url: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

/**
 * Start a new RTSP stream
 */
export async function startStream(request: StartStreamRequest): Promise<ApiResponse<Stream>> {
  try {
    const response = await fetch(`${API_URL}/api/streams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      return { error: error.error || 'Failed to start stream' }
    }

    const data = await response.json()
    return { data: data.stream }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' }
  }
}

/**
 * List all active streams
 */
export async function listStreams(): Promise<ApiResponse<Stream[]>> {
  try {
    const response = await fetch(`${API_URL}/api/streams`)

    if (!response.ok) {
      const error = await response.json()
      return { error: error.error || 'Failed to list streams' }
    }

    const data = await response.json()
    return { data: data.streams }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' }
  }
}

/**
 * Stop a running stream
 */
export async function stopStream(streamId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_URL}/api/streams/${streamId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      return { error: error.error || 'Failed to stop stream' }
    }

    return {}
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Network error' }
  }
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`)
    return response.ok
  } catch {
    return false
  }
}
