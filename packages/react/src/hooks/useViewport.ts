import { useCallback, useEffect, useRef, useState } from 'react'
import { HeightEngine, ViewportManager, type Message, type ViewportState } from '@flowchat/core'

interface UseViewportOptions {
  messages: Message[]
  font?: string
  lineHeight?: number
  overscan?: number
}

export function useViewport(options: UseViewportOptions) {
  const { messages, font = '16px Inter', lineHeight = 24, overscan = 5 } = options

  const engineRef = useRef<HeightEngine | null>(null)
  const viewportRef = useRef<ViewportManager | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState<ViewportState>({
    scrollTop: 0,
    viewportHeight: 0,
    totalHeight: 0,
    visibleRange: { start: 0, end: 0, offsetTop: 0 },
    isAnchored: true,
  })

  // Initialize engine + viewport
  useEffect(() => {
    const engine = new HeightEngine({ font, lineHeight, overscan })
    // Init without Pretext first (uses fallback), then lazy-load
    engineRef.current = engine
    viewportRef.current = new ViewportManager(engine, { overscan })

    engine.init().catch(() => {
      // Pretext not available — fallback height estimation continues
    })
  }, [font, lineHeight, overscan])

  // Recalculate on message changes
  useEffect(() => {
    const vm = viewportRef.current
    const el = containerRef.current
    if (!vm || !el) return

    const width = el.clientWidth
    vm.update(messages, width)

    setState(vm.getState(el.scrollTop, el.clientHeight))
  }, [messages])

  // Scroll handler
  const onScroll = useCallback(() => {
    const vm = viewportRef.current
    const el = containerRef.current
    if (!vm || !el) return

    vm.checkAnchor(el.scrollTop, el.clientHeight)
    setState(vm.getState(el.scrollTop, el.clientHeight))
  }, [])

  // Auto-scroll to bottom when anchored + new message
  useEffect(() => {
    const vm = viewportRef.current
    const el = containerRef.current
    if (!vm || !el || !vm.isAnchored) return

    el.scrollTop = vm.getTotalHeight()
  }, [messages.length])

  // Resize observer
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver(() => {
      const vm = viewportRef.current
      if (!vm) return
      vm.update(messages, el.clientWidth)
      setState(vm.getState(el.scrollTop, el.clientHeight))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [messages])

  return {
    containerRef,
    state,
    onScroll,
    engine: engineRef.current,
    viewport: viewportRef.current,
  }
}
