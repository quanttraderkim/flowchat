import type { ViewportRange } from "./types";

export class ViewportManager {
  private heights: number[] = [];
  private offsets: number[] = [0];

  constructor(private readonly overscanPx = 420) {}

  setHeights(heights: readonly number[]): void {
    this.heights = [...heights];
    this.offsets = new Array(this.heights.length + 1).fill(0);

    for (let index = 0; index < this.heights.length; index += 1) {
      this.offsets[index + 1] = this.offsets[index] + this.heights[index];
    }
  }

  updateHeight(index: number, height: number): void {
    this.heights[index] = height;

    for (let cursor = index; cursor < this.heights.length; cursor += 1) {
      this.offsets[cursor + 1] = this.offsets[cursor] + this.heights[cursor];
    }
  }

  appendHeight(height: number): void {
    this.heights.push(height);
    this.offsets.push(this.getTotalHeight() + height);
  }

  getVisibleRange(scrollTop: number, viewportHeight: number): ViewportRange {
    if (this.heights.length === 0) {
      return { start: 0, end: 0 };
    }

    const startOffset = Math.max(0, scrollTop - this.overscanPx);
    const endOffset = Math.min(
      this.getTotalHeight(),
      scrollTop + viewportHeight + this.overscanPx,
    );
    const start = this.findIndexAtOffset(startOffset);
    const end = Math.min(this.heights.length, this.findIndexAtOffset(endOffset) + 2);

    return { start, end };
  }

  getTotalHeight(): number {
    return this.offsets[this.offsets.length - 1] ?? 0;
  }

  getOffset(index: number): number {
    return this.offsets[index] ?? this.getTotalHeight();
  }

  getOffsets(): readonly number[] {
    return this.offsets;
  }

  isAnchored(
    scrollTop: number,
    viewportHeight: number,
    thresholdPx = 36,
  ): boolean {
    return this.getTotalHeight() - viewportHeight - scrollTop < thresholdPx;
  }

  private findIndexAtOffset(offset: number): number {
    let low = 0;
    let high = this.heights.length;

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if ((this.offsets[mid + 1] ?? 0) <= offset) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    return Math.min(low, Math.max(0, this.heights.length - 1));
  }
}
