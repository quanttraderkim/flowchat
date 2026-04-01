import { type CSSProperties, type ReactNode, useMemo } from 'react'
import type { Message } from '@flowchat/core'
import { useViewport } from './hooks/useViewport'

export interface ChatViewProps {
  messages: Message[]
  font?: string
  lineHeight?: number
  overscan?: number
  className?: string
  style?: CSSProperties
  renderMessage?: (message: Message, index: number) => ReactNode
}

function DefaultMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: 12,
        maxWidth: '80%',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        background: isUser ? '#007AFF' : '#F0F0F0',
        color: isUser ? '#fff' : '#000',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {message.content}
    </div>
  )
}

export function ChatView({
  messages,
  font,
  lineHeight,
  overscan,
  className,
  style,
  renderMessage,
}: ChatViewProps) {
  const { containerRef, state, onScroll } = useViewport({
    messages,
    font,
    lineHeight,
    overscan,
  })

  const { visibleRange, totalHeight } = state

  const visibleMessages = useMemo(
    () => messages.slice(visibleRange.start, visibleRange.end),
    [messages, visibleRange.start, visibleRange.end],
  )

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className={className}
      style={{
        overflow: 'auto',
        height: '100%',
        position: 'relative',
        ...style,
      }}
    >
      {/* Spacer for total scroll height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Positioned container for visible messages */}
        <div
          style={{
            position: 'absolute',
            top: visibleRange.offsetTop,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: '0 16px',
          }}
        >
          {visibleMessages.map((msg, i) => (
            <div key={msg.id}>
              {renderMessage
                ? renderMessage(msg, visibleRange.start + i)
                : <DefaultMessage message={msg} />
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
