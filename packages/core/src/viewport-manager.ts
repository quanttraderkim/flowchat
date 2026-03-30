/**
 * Viewport Manager — virtualization logic.
 *
 * Maintains a prefix-sum array of message heights to enable
 * O(log n) scroll-to-index and visible range calculation.
 */

import type { Message, VisibleRange, ViewportState } from './types'
import type { HeightEngine } from './height-engine'

export class ViewportManager {
  private heights: number[] = []
  private prefixSums: number[] = []
  private messageIds: string[] = []
  private _isAnchored = true
  private overscan: number
  private gap: number

  constructor(
    private engine: HeightEngine,
    options: { overscan?: number; messageGap?: number } = {},
  ) {
    this.overscan = options.overscan ?? 5
    this.gap = options.messageGap ?? 8
  }

  /** Recalculate all heights for given messages and container width */
  update(messages: Message[], containerWidth: number): void {
    this.heights = []
    this.prefixSums = []
    this.messageIds = []

    let sum = 0
    for (const msg of messages) {
      const h = this.engine.measure(msg, containerWidth) + this.gap
      this.heights.push(h)
      this.messageIds.push(msg.id)
      sum += h
      this.prefixSums.push(sum)
    }
  }

  /** Append a new message (avoids full recalc) */
  append(message: Message, containerWidth: number): void {
    const h = this.engine.measure(message, containerWidth) + this.gap
    const prevSum = this.prefixSums.length > 0
      ? this.prefixSums[this.prefixSums.length - 1]
      : 0
    this.heights.push(h)
    this.messageIds.push(message.id)
    this.prefixSums.push(prevSum + h)
  }

  /** Update height for a single message (e.g., during streaming) */
  updateOne(index: number, message: Message, containerWidth: number): void {
    if (index < 0 || index >= this.heights.length) return
    const newHeight = this.engine.measure(message, containerWidth) + this.gap
    const diff = newHeight - this.heights[index]
    if (Math.abs(diff) < 0.5) return // no meaningful change

    this.heights[index] = newHeight
    // Rebuild prefix sums from the changed index
    for (let i = index; i < this.prefixSums.length; i++) {
      this.prefixSums[i] = (i > 0 ? this.prefixSums[i - 1] : 0) + this.heights[i]
    }
  }

  /** Get the range of messages visible in the viewport */
  getVisibleRange(scrollTop: number, viewportHeight: number): VisibleRange {
    if (this.prefixSums.length === 0) {
      return { start: 0, end: 0, offsetTop: 0 }
    }

    // Binary search for the first message whose bottom edge is below scrollTop
    const startRaw = this.findIndex(scrollTop)
    const endRaw = this.findIndex(scrollTop + viewportHeight)

    // Apply overscan
    const start = Math.max(0, startRaw - this.overscan)
    const end = Math.min(this.prefixSums.length, endRaw + 1 + this.overscan)

    const offsetTop = start > 0 ? this.prefixSums[start - 1] : 0

    return { start, end, offsetTop }
  }

  /** Total scrollable height */
  getTotalHeight(): number {
    if (this.prefixSums.length === 0) return 0
    return this.prefixSums[this.prefixSums.length - 1]
  }

  /** Get offset (top position) for a specific message index */
  getOffsetForIndex(index: number): number {
    if (index <= 0) return 0
    if (index >= this.prefixSums.length) return this.getTotalHeight()
    return this.prefixSums[index - 1]
  }

  /** Scroll anchor — when true, viewport stays at bottom on new messages */
  get isAnchored(): boolean {
    return this._isAnchored
  }

  setAnchor(anchored: boolean): void {
    this._isAnchored = anchored
  }

  /** Check if user scrolled near bottom (within one viewport height) */
  checkAnchor(scrollTop: number, viewportHeight: number): void {
    const distanceFromBottom = this.getTotalHeight() - scrollTop - viewportHeight
    this._isAnchored = distanceFromBottom < viewportHeight * 0.5
  }

  /** Get full viewport state snapshot */
  getState(scrollTop: number, viewportHeight: number): ViewportState {
    return {
      scrollTop,
      viewportHeight,
      totalHeight: this.getTotalHeight(),
      visibleRange: this.getVisibleRange(scrollTop, viewportHeight),
      isAnchored: this._isAnchored,
    }
  }

  /** Number of managed messages */
  get count(): number {
    return this.heights.length
  }

  // --- Private ---

  /** Binary search: find index of first message at or after scrollTop */
  private findIndex(scrollTop: number): number {
    let lo = 0
    let hi = this.prefixSums.length - 1
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1
      if (this.prefixSums[mid] < scrollTop) {
        lo = mid + 1
      } else {
        hi = mid - 1
      }
    }
    return Math.min(lo, this.prefixSums.length - 1)
  }
}
