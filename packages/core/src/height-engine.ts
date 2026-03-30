/**
 * Height Engine — DOM-free text measurement via Pretext.
 *
 * Core idea: prepare() is expensive (text segmentation + font measurement),
 * but layout() is nearly free (pure arithmetic). We cache prepare() results
 * and only re-run layout() on resize.
 */

import type { ContentBlock, FlowChatConfig, HeightCache, Message } from './types'
import { DEFAULT_CONFIG } from './types'

// Pretext types (imported at runtime)
type PreparedText = unknown
type PrepareFn = (text: string, font: string) => PreparedText
type LayoutFn = (prepared: PreparedText, maxWidth: number, lineHeight: number) => { height: number; lineCount: number }

interface PretextModule {
  prepare: PrepareFn
  layout: LayoutFn
}

/** Prepared text cache: messageId → Pretext prepared handle */
const preparedCache = new Map<string, PreparedText>()

/** Height cache: `${messageId}:${width}` → pixel height */
class HeightCacheImpl implements HeightCache {
  private cache = new Map<string, number>()

  get(id: string): number | undefined {
    return this.cache.get(id)
  }

  set(id: string, height: number): void {
    this.cache.set(id, height)
  }

  invalidate(id: string): void {
    // Remove all entries for this message (any width)
    for (const key of this.cache.keys()) {
      if (key.startsWith(id + ':')) {
        this.cache.delete(key)
      }
    }
    this.cache.delete(id)
    preparedCache.delete(id)
  }

  clear(): void {
    this.cache.clear()
    preparedCache.clear()
  }
}

export function createHeightCache(): HeightCache {
  return new HeightCacheImpl()
}

export class HeightEngine {
  private pretext: PretextModule | null = null
  private config: FlowChatConfig
  private cache: HeightCacheImpl

  constructor(config: Partial<FlowChatConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.cache = new HeightCacheImpl()
  }

  /**
   * Initialize with Pretext module.
   * Kept async so we can lazy-load Pretext only when needed.
   */
  async init(pretext?: PretextModule): Promise<void> {
    if (pretext) {
      this.pretext = pretext
    } else {
      // Dynamic import — works with bundlers
      this.pretext = await import('@chenglou/pretext') as unknown as PretextModule
    }
  }

  /**
   * Measure a single message's height in pixels.
   * Uses Pretext prepare()+layout() with caching.
   */
  measure(message: Message, containerWidth: number): number {
    const cacheKey = `${message.id}:${containerWidth}`
    const cached = this.cache.get(cacheKey)
    if (cached !== undefined) return cached

    const height = this.computeHeight(message, containerWidth)
    this.cache.set(cacheKey, height)
    return height
  }

  /**
   * Measure partial streaming text without full re-prepare.
   * For streaming, we prepare once and re-layout on each token.
   */
  measurePartial(messageId: string, text: string, containerWidth: number): number {
    if (!this.pretext) return this.fallbackHeight(text, containerWidth)

    // Re-prepare on significant text changes (every ~200 chars)
    const prepared = preparedCache.get(messageId)
    const needsReprepare = !prepared || text.length % 200 < 5

    if (needsReprepare) {
      const newPrepared = this.pretext.prepare(text, this.config.font)
      preparedCache.set(messageId, newPrepared)
    }

    const handle = preparedCache.get(messageId)!
    const { height } = this.pretext.layout(handle, containerWidth, this.config.lineHeight)
    const total = height + this.config.messagePadding
    this.cache.set(`${messageId}:${containerWidth}`, total)
    return total
  }

  /**
   * Remeasure all messages at a new container width.
   * Only calls layout() (not prepare()) — very fast.
   */
  remeasureAll(messages: Message[], newWidth: number): Map<string, number> {
    const results = new Map<string, number>()
    for (const msg of messages) {
      const height = this.measure(msg, newWidth)
      results.set(msg.id, height)
    }
    return results
  }

  /** Invalidate cache for a message (e.g., after edit) */
  invalidate(messageId: string): void {
    this.cache.invalidate(messageId)
  }

  /** Get current config */
  getConfig(): Readonly<FlowChatConfig> {
    return this.config
  }

  // --- Private ---

  private computeHeight(message: Message, containerWidth: number): number {
    // If message has pre-parsed blocks, measure each
    if (message.blocks?.length) {
      return this.measureBlocks(message.id, message.blocks, containerWidth)
    }
    // Otherwise treat entire content as text
    return this.measureText(message.id, message.content, containerWidth) + this.config.messagePadding
  }

  private measureText(id: string, text: string, width: number): number {
    if (!this.pretext) return this.fallbackHeight(text, width)

    let prepared = preparedCache.get(id)
    if (!prepared) {
      prepared = this.pretext.prepare(text, this.config.font)
      preparedCache.set(id, prepared)
    }

    const { height } = this.pretext.layout(prepared, width, this.config.lineHeight)
    return height
  }

  private measureBlocks(messageId: string, blocks: ContentBlock[], width: number): number {
    let total = 0
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      switch (block.type) {
        case 'text':
          total += this.measureText(`${messageId}:b${i}`, block.content, width)
          break
        case 'code': {
          // Code blocks: fixed line-height × line count + padding
          const lines = block.content.split('\n').length
          const codeLineHeight = 20 // monospace line height
          const codePadding = 32    // top + bottom padding
          total += lines * codeLineHeight + codePadding
          break
        }
        case 'image':
          total += 200 // placeholder height before load
          break
        case 'table':
          total += this.measureText(`${messageId}:b${i}`, block.content, width)
          break
      }
    }
    return total + this.config.messagePadding
  }

  /** Fallback when Pretext not loaded — rough estimation */
  private fallbackHeight(text: string, width: number): number {
    const avgCharWidth = 8 // rough average for 16px font
    const charsPerLine = Math.max(Math.floor(width / avgCharWidth), 1)
    const lineCount = Math.ceil(text.length / charsPerLine)
    return lineCount * this.config.lineHeight + this.config.messagePadding
  }
}
