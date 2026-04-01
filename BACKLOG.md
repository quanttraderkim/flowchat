# FlowChat Backlog

GitHub Issues로 올릴 항목들. 우선순위: P0(블로커) > P1(중요) > P2(개선) > P3(나중에)

---

## P0 — v0.1 블로커

### #1 Unit tests for HeightEngine
- `measure()` 기본 동작, 캐시 hit/miss, `invalidate()` 후 재계산
- Pretext 없을 때 fallback 정확도
- `measurePartial()` 스트리밍 시나리오
- `remeasureAll()` 리사이즈 시나리오

### #2 Unit tests for ViewportManager
- `getVisibleRange()` edge cases (빈 리스트, 1개, 1000개)
- `append()` vs `update()` 일관성
- `updateOne()` prefix sum 재계산 정확성
- `checkAnchor()` 임계값 동작
- Binary search 경계값

### #3 Demo: 1K message stress test
- 1,000개 메시지 생성 (랜덤 길이, 한글/영어/이모지 혼합)
- 초기 렌더 시간 측정
- 스크롤 FPS 표시 (requestAnimationFrame 카운터)
- DOM 노드 수 실시간 표시
- react-virtuoso 동일 데이터로 비교 데모

### #4 Performance benchmark script
- `@flowchat/core` 단독 벤치마크 (브라우저 불필요 부분)
- HeightEngine: 1K 메시지 measure 총 시간
- ViewportManager: update + getVisibleRange 1K회
- 결과 JSON 출력 (CI용)

### #5 npm publish setup
- `@flowchat/core`, `@flowchat/react` 패키지 빌드 확인
- `pnpm build` → `dist/` 정상 출력
- `package.json` files/main/types 필드 검증
- npm publish dry-run

---

## P1 — v0.2 준비

### #6 Markdown block parser
- 입력: raw markdown string
- 출력: `ContentBlock[]` (text, code, image, table)
- 코드블록 language 파싱
- Nested formatting (bold inside list 등)은 text block 내부에서 처리
- 의존성: 없음 (직접 파싱) or remark-parse (경량)

### #7 Code block height calculation
- 고정 line-height (20px) × 줄 수 + padding
- Language tag 표시 영역 높이
- 가로 오버플로 시 스크롤바 높이 추가
- 접힌 코드블록 (>30줄) 최소 높이

### #8 Shiki integration for syntax highlighting
- Lazy load (코드블록 없으면 로드 안 함)
- Theme 연동 (light/dark)
- Language auto-detect fallback
- SSR 지원 가능 여부 확인

---

## P2 — 개선

### #9 Pretext prepare() cache eviction strategy
- 현재: 메시지별 캐시, eviction 없음
- 문제: 10,000 메시지 대화 시 메모리 무한 증가
- 해결: LRU 캐시 (viewport 밖 오래된 것부터 evict)
- prepare() 캐시 vs height 캐시 분리 전략

### #10 ResizeObserver debounce
- 현재: 리사이즈마다 전체 remeasure
- 문제: 드래그 리사이즈 시 과도한 layout() 호출
- 해결: 150ms debounce + 최종 크기에서 1회 remeasure

### #11 Scroll restoration on navigation
- 페이지 이동 후 돌아왔을 때 스크롤 위치 복원
- `sessionStorage`에 scrollTop + 첫 visible messageId 저장
- 복원 시 해당 메시지로 스크롤

### #12 Smooth scroll to bottom button
- 새 메시지 도착 + anchor 해제 상태 → "↓ 새 메시지" 버튼
- 클릭 시 smooth scroll + anchor 재설정
- 읽지 않은 메시지 수 badge

### #13 Empty state / loading state
- 메시지 0개 → empty state 슬롯
- 초기 로딩 → skeleton 메시지 (높이 추정)
- 무한 스크롤 위로 → loading indicator

---

## P3 — 나중에

### #14 Virtual keyboard handling (mobile)
- iOS/Android 가상 키보드 올라올 때 viewport 재계산
- `visualViewport` API 활용
- Input focus 시 anchor 강제 + 마지막 메시지로 스크롤

### #15 Accessibility audit
- ARIA: `role="log"`, `aria-live="polite"` for new messages
- 키보드: 위/아래 화살표로 메시지 간 이동
- 스크린 리더: 가상화된 메시지도 접근 가능
- Focus management: 새 메시지 arrival 시 포커스 정책

### #16 Server-side height pre-calculation
- Pretext server-side 지원 시 SSR에서 높이 미리 계산
- 초기 HTML에 높이 데이터 포함 → hydration 시 레이아웃 시프트 0
- Next.js / Remix 호환

### #17 Vue adapter
- `@flowchat/vue` 패키지
- `<FlowChat />` component + `useFlowChat` composable
- `@flowchat/core` 그대로 사용, UI 바인딩만 Vue

### #18 Infinite scroll (load older messages)
- 위로 스크롤 → 이전 메시지 로드
- 로드 중 스크롤 위치 유지 (prepend 후 offsetTop 보정)
- `onLoadMore` callback
