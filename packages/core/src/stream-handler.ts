/**
 * Stream Handler — manages streaming token updates.
 *
 * Buffers incoming tokens, batches height recalculations,
 * and notifies the viewport manager to maintain scroll position.
 */

import type { Message } from './types'
import type { HeightEngine } from './height-engine'
import type { ViewportManager } from './viewport-manager'

export interface StreamCallbacks {
  /** Called when message content updates (for React state) */
  onContentUpdate: (messageId: string, content: string) => void
  /** Called when height changes (for viewport adjustment) */
  onHeightChange: (messageId: string, newHeight: number) => void
  /** Called when streaming completes */
  onComplete: (messageId: string) => void
}

export class StreamHandler {
  private activeStreams = new Map<string, StreamState>()
  private rafId: number | null = null

  constructor(
    private engine: HeightEngine,
    private viewport: ViewportManager,
    private containerWidth: number,
    private callbacks: StreamCallbacks,
  ) {}

  /** Start tracking a streaming message */
  start(messageId: string): void {
    this.activeStreams.set(messageId, {
      messageId,
      buffer: '',
      dirty: false,
      lastMeasuredLength: 0,
    })
    this.scheduleFlush()
  }

  /** Append a token to a streaming message */
  onToken(messageId: string, token: string): void {
    const state = this.activeStreams.get(messageId)
    if (!state) return
    state.buffer += token
    state.dirty = true
    this.scheduleFlush()
  }

  /** Mark streaming as complete */
  complete(messageId: string): void {
    const state = this.activeStreams.get(messageId)
    if (state) {
      // Final flush
      this.flushOne(state)
      this.activeStreams.delete(messageId)
    }
    // Invalidate cache so next measure gets final height
    this.engine.invalidate(messageId)
    this.callbacks.onComplete(messageId)
  }

  /** Check if any stream is active */
  get isStreaming(): boolean {
    return this.activeStreams.size > 0
  }

  /** Update container width (e.g., on resize) */
  setContainerWidth(width: number): void {
    this.containerWidth = width
  }

  /** Clean up */
  destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    this.activeStreams.clear()
  }

  // --- Private ---

  private scheduleFlush(): void {
    if (this.rafId !== null) return
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null
      this.flush()
    })
  }

  private flush(): void {
    for (const state of this.activeStreams.values()) {
      if (state.dirty) {
        this.flushOne(state)
      }
    }
  }

  private flushOne(state: StreamState): void {
    state.dirty = false
    const { messageId, buffer } = state

    // Only remeasure if text grew significantly (>50 chars since last measure)
    const shouldRemeasure = buffer.length - state.lastMeasuredLength > 50
    if (shouldRemeasure) {
      const height = this.engine.measurePartial(messageId, buffer, this.containerWidth)
      state.lastMeasuredLength = buffer.length
      this.callbacks.onHeightChange(messageId, height)
    }

    this.callbacks.onContentUpdate(messageId, buffer)
  }
}

interface StreamState {
  messageId: string
  buffer: string
  dirty: boolean
  lastMeasuredLength: number
}
