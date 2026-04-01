# FlowChat

Virtualized AI chat UI powered by [Pretext](https://github.com/chenglou/pretext).

> DOM-free text measurement → true virtualization → 1,000+ messages at 60fps.

## The Problem

Every AI app builds a chat UI. None of them handle long conversations well:

- **1,000 messages?** Scroll freezes. Every message is in the DOM.
- **Streaming response?** Layout shifts. Scroll position jumps.
- **Mixed content?** Markdown + code blocks + Korean + emoji = unpredictable heights.
- **Virtualization?** Requires knowing heights upfront. `getBoundingClientRect` triggers reflow.

## How It Works

FlowChat uses [Pretext](https://github.com/chenglou/pretext) to measure text height **without touching the DOM**:

```
1,000 messages in conversation
├── Pretext calculates all heights (zero DOM reads)
├── Only 15-20 visible messages rendered to DOM
├── Scrollbar is pixel-accurate to total height
└── Streaming tokens update layout() in <1ms
```

## Quickstart

```bash
npm install @flowchat/react @chenglou/pretext
```

```tsx
import { ChatView } from '@flowchat/react'

function App() {
  const [messages, setMessages] = useState([])

  return (
    <div style={{ height: '100vh' }}>
      <ChatView
        messages={messages}
        font="16px Inter"
      />
    </div>
  )
}
```

## Packages

| Package | Description |
|---------|-------------|
| `@flowchat/core` | Framework-agnostic engine (HeightEngine, ViewportManager, StreamHandler) |
| `@flowchat/react` | React components (`<ChatView />`, `useViewport` hook) |

## Architecture

```
@flowchat/react
  <ChatView /> — renders only visible messages
  useViewport() — scroll state + resize handling
      │
@flowchat/core
  HeightEngine — Pretext prepare()/layout() with caching
  ViewportManager — prefix-sum array, O(log n) visible range
  StreamHandler — batched token updates via requestAnimationFrame
      │
@chenglou/pretext
  prepare() — one-time text segmentation + font measurement
  layout() — pure arithmetic height calculation (<0.1ms)
```

## Key Design Decisions

- **Pretext prepare() cached, layout() on hot path** — prepare is ~19ms for 500 texts, layout is ~0.09ms. We cache prepare results and only re-run layout on resize.
- **Prefix-sum array for O(log n) scroll** — binary search to find visible range instead of scanning all heights.
- **requestAnimationFrame batching for streams** — tokens arrive faster than frames. We batch updates to one recalc per frame.
- **Fallback when Pretext unavailable** — rough `charCount / charsPerLine` estimation. Works without Pretext, just less accurate.

## Development

```bash
pnpm install
pnpm dev        # start all packages in dev mode
pnpm test       # run tests
pnpm build      # build all packages
```

## Status

v0.1 alpha — core virtualization engine + basic React component.

## License

MIT
