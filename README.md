# FlowChat Demo

대환님 팀에 바로 공유할 수 있도록 만든 설치 없는 브라우저 데모입니다. `@chenglou/pretext`를 CDN ESM으로 불러와서 텍스트 높이를 먼저 계산하고, 그 결과로 채팅 메시지 목록을 가상화합니다. 동시에 다음 단계 작업을 바로 이어갈 수 있게 `packages/core`, `packages/react` 스캐폴딩과 Vercel 배포 설정도 같이 넣어두었습니다.

## 실행

이 프로젝트는 로컬 정적 서버 하나면 충분합니다.

```sh
cd "/Users/daehwan/Documents/New project"
python3 -m http.server 4173
```

그다음 브라우저에서 `http://127.0.0.1:4173`을 여시면 됩니다.

## Vercel 배포

네, 지금 구조는 Vercel에 올리기 좋습니다. 루트에 [vercel.json](/Users/daehwan/Documents/New%20project/vercel.json)도 넣어두었고, 정적 데모라서 별도 번들 빌드가 없어도 됩니다.

Vercel에서 연결하실 때는 저장소 루트를 그대로 잡고, Framework Preset은 `Other`, Build Command는 비워두시거나 자동 감지를 끄고, Output Directory도 루트 그대로 두시면 됩니다. 배포 후에는 현재 루트의 `index.html`이 그대로 서빙됩니다.

## 데모에서 보여줄 포인트

팀에 공유하실 때는 아래 순서가 가장 설명력이 좋습니다.

1. 처음 로드된 1,000개 메시지 상태에서 렌더 노드 수가 낮게 유지되는지 봅니다.
2. 채팅 프레임 폭 슬라이더를 움직여 line wrap과 전체 높이가 다시 계산되는지 봅니다.
3. 중간쯤 스크롤한 뒤 `스트리밍 데모 시작`을 눌러 bottom anchor가 켜진 경우와 꺼진 경우를 비교합니다.
4. 직접 메시지를 보내서 assistant 응답이 토큰 단위로 늘어나는 동안 레이아웃이 어떻게 유지되는지 봅니다.

## 현재 범위

이 데모는 PRD의 v0.1 방향에 맞춘 plain text MVP입니다.

- `prepare()` + `layout()` 기반 높이 계산
- prefix sum 기반 visible range 계산
- bottom anchor 유지
- width 변경 시 전체 재계산
- assistant 응답 스트리밍

아직 포함하지 않은 것은 markdown block 분리, code block 높이 계산, 정식 React 패키지 배포, 벤치마크 자동화입니다.

## 다음 단계

환경에 `node`와 `pnpm`이 준비되면 다음 순서로 확장하는 것이 좋습니다. 지금은 아래 파일들까지 미리 만들어 두었습니다.

1. [packages/core/src/height-engine.ts](/Users/daehwan/Documents/New%20project/packages/core/src/height-engine.ts) 에 `PretextHeightEngine` 추가
2. [packages/core/src/viewport-manager.ts](/Users/daehwan/Documents/New%20project/packages/core/src/viewport-manager.ts) 에 `ViewportManager` 추가
3. [packages/react/src/ChatView.tsx](/Users/daehwan/Documents/New%20project/packages/react/src/ChatView.tsx) 에 React용 `ChatView` 초안 추가
4. 루트 [package.json](/Users/daehwan/Documents/New%20project/package.json), [pnpm-workspace.yaml](/Users/daehwan/Documents/New%20project/pnpm-workspace.yaml), [tsconfig.base.json](/Users/daehwan/Documents/New%20project/tsconfig.base.json) 로 워크스페이스 기반 뼈대 추가

다만 현재 로컬 환경에는 `node`, `npm`, `pnpm`이 없어서 타입체크나 번들 빌드까지는 아직 실행하지 못했습니다. 그래서 지금 단계는 "데모는 바로 확인 가능하고, 패키지 구조는 바로 이어서 작업할 수 있게 준비된 상태"로 보시면 됩니다.
