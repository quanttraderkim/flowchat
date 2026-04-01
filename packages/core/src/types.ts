/** Core data types for FlowChat */

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  blocks?: ContentBlock[]
  status: 'complete' | 'streaming' | 'error'
  timestamp: number
  metadata?: Record<string, unknown>
}

export interface ContentBlock {
  type: 'text' | 'code' | 'image' | 'table'
  content: string
  language?: string
  measuredHeight?: number
}

export interface HeightCache {
  /** Message ID → measured pixel height */
  get(id: string): number | undefined
  set(id: string, height: number): void
  invalidate(id: string): void
  clear(): void
}

export interface VisibleRange {
  /** First visible message index (inclusive) */
  start: number
  /** Last visible message index (exclusive) */
  end: number
  /** Pixel offset of the first visible message */
  offsetTop: number
}

export interface ViewportState {
  scrollTop: number
  viewportHeight: number
  totalHeight: number
  visibleRange: VisibleRange
  isAnchored: boolean
}

export interface FlowChatConfig {
  /** Pretext font string, e.g. "16px Inter" */
  font: string
  /** Line height in pixels */
  lineHeight: number
  /** Extra messages to render above/below viewport */
  overscan: number
  /** Padding inside message bubble (top + bottom) */
  messagePadding: number
  /** Gap between messages */
  messageGap: number
}

export const DEFAULT_CONFIG: FlowChatConfig = {
  font: '16px Inter',
  lineHeight: 24,
  overscan: 5,
  messagePadding: 24,
  messageGap: 8,
}
