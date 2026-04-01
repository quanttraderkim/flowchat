# FlowChat Roadmap

## v0.1 — Core Virtualization (MVP)
> 텍스트 메시지 + virtualization이 동작하는 최소 제품

- [x] Project scaffolding (monorepo, packages)
- [x] `HeightEngine` — Pretext 연동 + fallback + caching
- [x] `ViewportManager` — prefix-sum, binary search, anchor
- [x] `StreamHandler` — rAF batched token updates
- [x] `<ChatView />` — React 컴포넌트
- [x] `useViewport` hook
- [ ] Unit tests (HeightEngine, ViewportManager)
- [ ] 1,000 message demo page
- [ ] Performance benchmark (vs raw DOM, vs react-virtuoso)
- [ ] npm publish: `@flowchat/core`, `@flowchat/react`

**Exit criteria:** 1K 메시지 초기 렌더 <100ms, 스크롤 60fps, DOM 노드 <50

## v0.2 — Markdown + Code Blocks
> AI 응답의 핵심인 마크다운 렌더링

- [ ] Markdown parser (text/code/image 블록 분리)
- [ ] `ContentBlock` 기반 블록별 높이 계산
- [ ] Code block syntax highlighting (Shiki)
- [ ] Code copy button
- [ ] Inline code, bold, italic, links
- [ ] Block-level height = sum of block heights
- [ ] Tests for mixed content height accuracy

**Exit criteria:** 마크다운+코드 혼합 메시지 높이 오차 <5%

## v0.3 — Streaming
> 실시간 토큰 스트리밍 중에도 부드러운 UX

- [ ] `StreamHandler` 실전 연동 (SSE, WebSocket)
- [ ] Streaming 중 anchor 유지 (아래 고정)
- [ ] Streaming 중 위 스크롤해도 안 밀림
- [ ] Partial prepare() 최적화 (200자마다 re-prepare)
- [ ] Typing indicator
- [ ] `useStream` hook

**Exit criteria:** 스트리밍 토큰 → 화면 반영 <16ms (1 frame)

## v0.4 — Theming + Customization
> 어떤 앱에든 붙일 수 있도록

- [ ] Light / Dark 테마
- [ ] CSS variables 기반 완전 커스터마이징
- [ ] `renderMessage` custom renderer
- [ ] `renderCodeBlock` custom renderer
- [ ] Avatar, timestamp, reaction 슬롯
- [ ] 모바일 반응형 (터치 스크롤 최적화)
- [ ] Tailwind CSS 지원 (className 패스스루)

## v0.5 — Rich Content
> 이미지, tool call 등 AI 에이전트 UI 필수 요소

- [ ] 이미지 메시지 (lazy load + placeholder 높이)
- [ ] Tool call / function call 시각화
- [ ] Citation 링크
- [ ] File attachment 표시
- [ ] Table 렌더링
- [ ] LaTeX / Math 블록

## v0.6 — Interaction
> 채팅 UI의 인터랙션 완성

- [ ] 메시지 편집
- [ ] 메시지 재생성
- [ ] 메시지 삭제
- [ ] 리액션 (이모지)
- [ ] 검색 (Ctrl+F, virtualized list에서)
- [ ] 메시지 복사 (전체 / 블록 단위)

## v1.0 — Production Ready
> 실서비스에 바로 넣을 수 있는 수준

- [ ] 접근성 (ARIA roles, 키보드 내비게이션)
- [ ] i18n (RTL 지원 — Pretext bidi 활용)
- [ ] 성능 벤치마크 대시보드 (CI에서 자동)
- [ ] Server-side height calculation (Pretext SSR 지원 시)
- [ ] Vue adapter (`@flowchat/vue`)
- [ ] Svelte adapter (`@flowchat/svelte`)
- [ ] Comprehensive docs site
- [ ] Migration guide (from react-virtuoso, chatscope)
