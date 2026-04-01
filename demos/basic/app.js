const MESSAGE_FONT =
  '500 15px "Pretendard Variable", Pretendard, "SUIT Variable", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
const MESSAGE_LINE_HEIGHT = 24;
const BUBBLE_PADDING_X = 34;
const BUBBLE_PADDING_Y = 56;
const MESSAGE_GAP = 16;
const OVERSCAN_PX = 440;
const EMPTY_TEXT_WIDTH = 132;
const AMBIENT_ORBS = [
  { id: "stageOrb1", baseX: 8, baseY: 10, ampX: 10, ampY: 7, speedX: 0.00016, speedY: 0.00012, scale: 1.02 },
  { id: "stageOrb2", baseX: 58, baseY: 4, ampX: 9, ampY: 10, speedX: 0.00012, speedY: 0.00017, scale: 1.14 },
  { id: "stageOrb3", baseX: 66, baseY: 52, ampX: 12, ampY: 8, speedX: 0.00018, speedY: 0.00011, scale: 1.06 },
];
const GRAPHEME_SEGMENTER =
  typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter("ko", { granularity: "grapheme" })
    : null;
const SPELL_GLYPHS = [
  "ᚠ",
  "ᚢ",
  "ᚦ",
  "ᚱ",
  "ᚲ",
  "ᚷ",
  "ᚹ",
  "ᚺ",
  "ᚾ",
  "ᛁ",
  "ᛃ",
  "ᛇ",
  "ᛈ",
  "ᛉ",
  "ᛋ",
  "ᛏ",
  "ᛒ",
  "ᛖ",
  "ᛗ",
  "ᛚ",
  "ᛜ",
  "ᛞ",
  "ᛟ",
];

const ARTIFACT_MODES = {
  off: {
    key: "off",
    badge: "OFF",
    enabled: false,
    note:
      "기본 커서를 유지하고, 헤드라인의 magnetic reaction도 끈 상태로 차분하게 데모를 볼 수 있습니다.",
    description:
      "아티팩트를 끄면 페이지는 조용한 에디토리얼 스테이지만 유지하고, 커서 기반 반응은 멈춥니다.",
    stageHint: "Artifacts off · Tight bubbles still powered by Pretext · Virtualized chat stays live",
    hueOffset: 24,
    panelGlow: 0.18,
    influenceRadius: 0,
    hueSpread: 0,
    scale: 1,
    icon: "",
  },
  orb: {
    key: "orb",
    badge: "ORB",
    enabled: true,
    note:
      "오브 모드는 위성 세 개가 원형으로 돌고, 가까운 텍스트와 버블이 원궤도로 말리듯 반응합니다.",
    description:
      "단순히 끌어당기기보다, 커서 주위를 중심으로 문장과 버블이 원형으로 감기며 흐르는 모드입니다.",
    stageHint: "Orb mode · Circular drag field · Orbiting satellites bend the chat surface",
    hueOffset: 0,
    panelGlow: 0.48,
    influenceRadius: 280,
    hueSpread: 26,
    scale: 1,
    icon: `
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <circle cx="48" cy="48" r="18" stroke-width="3.2"></circle>
        <path d="M48 14v12M48 70v12M14 48h12M70 48h12M25 25l8 8M63 63l8 8M71 25l-8 8M33 63l-8 8" stroke-width="3.2"></path>
      </svg>
    `,
  },
  sword: {
    key: "sword",
    badge: "SWORD",
    enabled: true,
    note:
      "검 모드는 빠르게 휘두를 때 슬래시가 생기고, 가까운 버블이 절개되듯 양쪽으로 갈라집니다.",
    description:
      "색만 바뀌는 게 아니라, 스와이프 속도로 칼날이 생기고 텍스트 면이 실제로 베이는 쪽으로 설계한 모드입니다.",
    stageHint: "Sword mode · Fast swipe to cut · Nearby rows split across the slash path",
    hueOffset: 196,
    panelGlow: 0.38,
    influenceRadius: 320,
    hueSpread: 18,
    scale: 1.03,
    icon: `
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <path d="M58 10l18 18-9 9-19-19 4-8 6 0z" stroke-width="3.6"></path>
        <path d="M43 43l10 10-19 19a8 8 0 0 1-11 0l-1-1a8 8 0 0 1 0-11z" stroke-width="3.6"></path>
        <path d="M33 53l10 10" stroke-width="4.2"></path>
        <path d="M26 46l24 24" stroke-width="4.2"></path>
      </svg>
    `,
  },
  staff: {
    key: "staff",
    badge: "STAFF",
    enabled: true,
    note:
      "지팡이 모드는 위나 좌우로 휘두르면 주문이 발동하고, 채팅 텍스트가 잠시 룬 문자로 변합니다.",
    description:
      "방향 제스처를 주문으로 해석해서, 광선과 링을 뿌리고 텍스트 표면 자체를 마법처럼 바꾸는 모드입니다.",
    stageHint: "Staff mode · Cast upward or sideways · Spell beams rewrite visible text",
    hueOffset: 96,
    panelGlow: 0.58,
    influenceRadius: 300,
    hueSpread: 34,
    scale: 1.02,
    icon: `
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <path d="M48 10l10 10-10 10-10-10z" stroke-width="3.2"></path>
        <path d="M48 30v42" stroke-width="4.2"></path>
        <path d="M42 74h12" stroke-width="4.2"></path>
        <path d="M22 22l6 6M68 22l6 6M20 38h8M68 38h8" stroke-width="3"></path>
      </svg>
    `,
  },
  fist: {
    key: "fist",
    badge: "FIST",
    enabled: true,
    note:
      "주먹 모드는 아래로 내리치듯 클릭하면 충격파가 퍼지고, 버블이 밀려나며 크게 흔들립니다.",
    description:
      "표면을 누르는 정도가 아니라, 충격 반경이 화면 전체로 전파되도록 만든 슬램 계열 모드입니다.",
    stageHint: "Fist mode · Slam downward · Shockwaves punch through the viewport",
    hueOffset: 30,
    panelGlow: 0.28,
    influenceRadius: 250,
    hueSpread: 14,
    scale: 0.98,
    icon: `
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <path d="M24 46v-8a4 4 0 0 1 8 0v8" stroke-width="3.4"></path>
        <path d="M36 42v-12a4 4 0 0 1 8 0v12" stroke-width="3.4"></path>
        <path d="M48 42v-11a4 4 0 0 1 8 0v11" stroke-width="3.4"></path>
        <path d="M60 45v-8a4 4 0 0 1 8 0v14a18 18 0 0 1-18 18H38A14 14 0 0 1 24 55v-8a5 5 0 0 1 10 0v4" stroke-width="3.4"></path>
      </svg>
    `,
  },
};

const refs = {
  body: document.body,
  introPanel: document.querySelector("#introPanel"),
  heroTitle: document.querySelector("#heroTitle"),
  orbitNote: document.querySelector("#orbitNote"),
  cursorOrb: document.querySelector("#cursorOrb"),
  cursorGlyph: document.querySelector("#cursorGlyph"),
  cursorLabel: document.querySelector("#cursorLabel"),
  slashEffect: document.querySelector("#slashEffect"),
  spellEffect: document.querySelector("#spellEffect"),
  spellLabel: document.querySelector("#spellLabel"),
  shockwaveEffect: document.querySelector("#shockwaveEffect"),
  stageHint: document.querySelector(".stage-hint"),
  viewport: document.querySelector("#viewport"),
  spacer: document.querySelector("#spacer"),
  chatFrame: document.querySelector("#chatFrame"),
  widthSlider: document.querySelector("#widthSlider"),
  widthValue: document.querySelector("#widthValue"),
  streamButton: document.querySelector("#streamButton"),
  jumpButton: document.querySelector("#jumpButton"),
  sendButton: document.querySelector("#sendButton"),
  composerInput: document.querySelector("#composerInput"),
  statusBadge: document.querySelector("#statusBadge"),
  messageCount: document.querySelector("#messageCount"),
  renderedCount: document.querySelector("#renderedCount"),
  totalHeight: document.querySelector("#totalHeight"),
  measureTime: document.querySelector("#measureTime"),
  anchorState: document.querySelector("#anchorState"),
  artifactState: document.querySelector("#artifactState"),
  shrinkState: document.querySelector("#shrinkState"),
  engineState: document.querySelector("#engineState"),
  modeCopy: document.querySelector("#modeCopy"),
  stageOrbs: AMBIENT_ORBS.map((orb) => document.querySelector(`#${orb.id}`)),
  heroWords: [],
};

const state = {
  messages: [],
  measurements: [],
  heights: [],
  offsets: [0],
  visibleRows: [],
  prepared: new Map(),
  spellOverlayCache: new Map(),
  frameWidth: 640,
  artifactHue: 34,
  anchor: true,
  lastMeasureMs: 0,
  renderedCount: 0,
  shrinkPercent: 0,
  streamTimer: null,
  nextId: 1,
  pretext: null,
  pointer: {
    currentX: window.innerWidth * 0.5,
    currentY: window.innerHeight * 0.28,
    targetX: window.innerWidth * 0.5,
    targetY: window.innerHeight * 0.28,
    active: false,
    interactive: !window.matchMedia("(pointer: coarse)").matches,
    mode: "off",
    burstUntil: 0,
    now: 0,
    lastSampleX: window.innerWidth * 0.5,
    lastSampleY: window.innerHeight * 0.28,
    lastSampleAt: 0,
    velocityX: 0,
    velocityY: 0,
    speed: 0,
  },
  effects: {
    slash: {
      startedAt: 0,
      until: 0,
      duration: 0,
      cooldownUntil: 0,
      x: 0,
      y: 0,
      angle: 0,
      length: 0,
    },
    spell: {
      startedAt: 0,
      until: 0,
      duration: 0,
      cooldownUntil: 0,
      x: 0,
      y: 0,
      angle: -90,
      name: "",
      seed: 0,
      hue: 96,
    },
    shockwave: {
      startedAt: 0,
      until: 0,
      duration: 0,
      cooldownUntil: 0,
      x: 0,
      y: 0,
      power: 1,
    },
  },
  layout: {
    introPanelRect: null,
    viewportRect: null,
    heroWordRects: [],
  },
  lastEffectsActive: false,
  surfaceDirty: true,
  surfaceResetDone: false,
  motionStarted: false,
  appEventsBound: false,
};

const copyBank = {
  intros: [
    "이번 스테이지는 긴 대화도 실제 렌더 노드를 아주 적게 유지한 채 부드럽게 흘리도록 설계했습니다.",
    "핵심은 버블 높이를 DOM에서 재지 않고, Pretext로 먼저 계산한 뒤 가상화 범위만 렌더링하는 점입니다.",
    "Bubbles 데모에서 보이는 타이트한 버블 감각을 채팅 UI 쪽으로 옮겨보는 실험이라고 보시면 됩니다.",
    "에디토리얼 엔진처럼 광원과 계기판은 살아 있지만, 채팅 본체는 여전히 논리적으로 단단하게 움직입니다.",
    "팀에 설명하실 때는 폭 슬라이더와 스트리밍을 함께 보여주면 차이가 가장 선명하게 드러납니다.",
  ],
  details: [
    "한글, English, 줄바꿈, emoji가 섞여도 같은 엔진으로 line count와 height를 미리 계산합니다. 🚀",
    "화면 밖의 메시지는 렌더하지 않고, scroll thumb만 전체 높이를 알고 있는 상태를 유지합니다.",
    "버블 폭도 가능한 한 타이트하게 줄여 마지막 줄 뒤에 남는 빈 공간을 크게 줄였습니다.",
    "리사이즈가 일어나면 prepare 캐시는 유지하고 layout과 shrinkwrap 계산만 다시 돌면 됩니다.",
    "이 단계는 plain text 중심이지만, 이후 markdown block과 code block으로 확장하기 쉬운 구조입니다.",
  ],
  tails: [
    "이 정도 밀도만 되어도 단순한 채팅 리스트보다 훨씬 제품 데모 같아 보입니다.",
    "다음 단계에서는 코드블록과 citation, tool call 표현을 얹는 쪽이 자연스럽습니다.",
    "React 패키지로 옮길 때도 Height Engine과 Viewport Manager는 그대로 core에 남길 수 있습니다.",
    "실제 서비스 단계에서는 role별 폭 정책과 테마 토큰만 더 정교하게 다듬으면 됩니다.",
    "비교 벤치마크를 붙이면 설득력은 더 커지지만, 지금은 시각 데모만으로도 꽤 강하게 보입니다.",
  ],
  multiline: [
    "다음 스텝 제안:\n1. core 패키지 분리\n2. React 어댑터 고정\n3. markdown parser 연결",
    "리사이즈 대응 메모:\n- prepare 캐시 유지\n- walkLineRanges 재호출\n- prefix sum 재구성",
    "데모 포인트:\n- 1,000개 로드\n- 중간 스크롤\n- 스트리밍 시작\n- anchor 비교",
  ],
};

function mulberry32(seed) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(random, items) {
  return items[Math.floor(random() * items.length)];
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function nowTime(offsetMinutes) {
  const date = new Date(Date.now() + offsetMinutes * 60_000);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function getArtifactMode() {
  return ARTIFACT_MODES[state.pointer.mode] ?? ARTIFACT_MODES.off;
}

function getEffectProgress(effect) {
  if (effect.duration <= 0 || effect.until <= state.pointer.now) {
    return 1;
  }

  return clamp((state.pointer.now - effect.startedAt) / effect.duration, 0, 1);
}

function getEffectStrength(effect) {
  return 1 - getEffectProgress(effect);
}

function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return {
      distance: Math.hypot(px - x1, py - y1),
      side: 1,
    };
  }

  const t = clamp(((px - x1) * dx + (py - y1) * dy) / lengthSquared, 0, 1);
  const nearestX = x1 + dx * t;
  const nearestY = y1 + dy * t;
  const cross = dx * (py - y1) - dy * (px - x1);

  return {
    distance: Math.hypot(px - nearestX, py - nearestY),
    side: cross >= 0 ? 1 : -1,
  };
}

function buildSpellOverlay(text, seed = 0) {
  const cacheKey = `${seed}:${text}`;
  const cached = state.spellOverlayCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  let symbolIndex = 0;
  const overlay = Array.from(text)
    .map((character) => {
      if (character === " " || character === "\n" || character === "\t") {
        return character;
      }

      if (/[0-9]/.test(character)) {
        const digitGlyphs = ["✶", "✷", "✸", "✹", "✺", "✻", "✼", "✽", "✾", "✦"];
        return digitGlyphs[(Number(character) + seed) % digitGlyphs.length];
      }

      if (/[.,:;!?(){}\[\]"'`~/_+=-]/.test(character)) {
        return character;
      }

      const code = character.codePointAt(0) ?? 0;
      const glyph = SPELL_GLYPHS[(code + seed + symbolIndex * 5) % SPELL_GLYPHS.length];
      symbolIndex += 1;
      return glyph;
    })
    .join("");

  if (state.spellOverlayCache.size > 180) {
    state.spellOverlayCache.clear();
  }
  state.spellOverlayCache.set(cacheKey, overlay);
  return overlay;
}

function segmentGraphemes(text) {
  if (!GRAPHEME_SEGMENTER) {
    return Array.from(text);
  }

  return Array.from(GRAPHEME_SEGMENTER.segment(text), (entry) => entry.segment);
}

function ensureBubbleGlyphs(row) {
  if (!row.bubbleText) {
    return;
  }

  if (row.charNodes && row.charText === row.messageContent) {
    return;
  }

  row.bubbleText.textContent = "";
  row.charNodes = [];
  row.charText = row.messageContent;

  const fragment = document.createDocumentFragment();
  const graphemes = segmentGraphemes(row.messageContent);

  graphemes.forEach((grapheme, index) => {
    if (grapheme === "\n") {
      fragment.appendChild(document.createElement("br"));
      return;
    }

    const span = document.createElement("span");
    span.className = grapheme === " " ? "bubble-char bubble-char-space" : "bubble-char";
    span.textContent = grapheme === " " ? "\u00A0" : grapheme === "\t" ? "\u00A0\u00A0" : grapheme;
    span.style.setProperty("--char-index", `${index}`);
    fragment.appendChild(span);
    row.charNodes.push(span);
  });

  row.bubbleText.appendChild(fragment);
}

function resetBubbleGlyphs(row) {
  if (!row.charNodes || !row.charsActive) {
    return;
  }

  for (const node of row.charNodes) {
    node.style.setProperty("--char-shift-x", "0px");
    node.style.setProperty("--char-shift-y", "0px");
    node.style.setProperty("--char-rotate", "0deg");
    node.style.setProperty("--char-scale", "1");
  }

  row.charsActive = false;
}

function updateBubbleGlyphs(row, mode, influence, sliceStrength, spellAmount, waveAmount) {
  ensureBubbleGlyphs(row);
  if (!row.charNodes || row.charNodes.length === 0) {
    return;
  }

  const activeStrength = Math.max(influence, sliceStrength, spellAmount, waveAmount);
  if (activeStrength < 0.05) {
    resetBubbleGlyphs(row);
    return;
  }

  const total = row.charNodes.length;
  const now = state.pointer.now;

  row.charsActive = true;

  row.charNodes.forEach((node, index) => {
    const ratio = total <= 1 ? 0 : index / (total - 1);
    const centered = ratio - 0.5;
    const phase = now / 180 + index * 0.42;
    let shiftX = 0;
    let shiftY = 0;
    let rotate = 0;
    let scale = 1;

    if (mode.key === "orb") {
      shiftX = Math.cos(phase) * influence * 3.2 + centered * influence * 8;
      shiftY = Math.sin(phase) * influence * 6.2;
      rotate = Math.sin(phase) * influence * 10;
      scale = 1 + influence * 0.08;
    }

    if (mode.key === "sword") {
      shiftX = centered * (4 + sliceStrength * 24);
      shiftY = Math.sin(now / 110 + index * 0.3) * sliceStrength * 4;
      rotate = centered * sliceStrength * 24;
      scale = 1 + sliceStrength * 0.06;
    }

    if (mode.key === "staff") {
      shiftX =
        Math.sin(now / 210 + index * 0.45) * (influence * 1.8 + spellAmount * 4.2);
      shiftY =
        Math.cos(now / 170 + index * 0.55) * (influence * 3.2 + spellAmount * 8.4) -
        spellAmount * 3;
      rotate = Math.sin(now / 190 + index * 0.24) * spellAmount * 16;
      scale = 1 + spellAmount * 0.12 + influence * 0.03;
    }

    if (mode.key === "fist") {
      shiftX = centered * (influence * 5 + waveAmount * 34);
      shiftY = -waveAmount * (12 - Math.abs(centered) * 7) - influence * 1.4;
      rotate = centered * waveAmount * 18;
      scale = 1 + waveAmount * 0.08;
    }

    node.style.setProperty("--char-shift-x", `${shiftX.toFixed(2)}px`);
    node.style.setProperty("--char-shift-y", `${shiftY.toFixed(2)}px`);
    node.style.setProperty("--char-rotate", `${rotate.toFixed(2)}deg`);
    node.style.setProperty("--char-scale", `${scale.toFixed(3)}`);
  });
}

function resolveStaffSpell(dx, dy) {
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  if (dy < -24 && absY > absX * 1.15) {
    return {
      name: "AETHER LIFT",
      angle: -90,
      seed: 17,
      hue: 172,
    };
  }

  if (dx > 24 && absX > absY * 1.1) {
    return {
      name: "EMBER SWEEP",
      angle: 0,
      seed: 29,
      hue: 28,
    };
  }

  if (dx < -24 && absX > absY * 1.1) {
    return {
      name: "TIDE VEIL",
      angle: 180,
      seed: 43,
      hue: 214,
    };
  }

  return null;
}

function setupHeroTitle() {
  if (!refs.heroTitle) {
    return;
  }

  const words = refs.heroTitle.textContent.trim().split(/(\s+)/).filter(Boolean);
  refs.heroTitle.textContent = "";

  for (const word of words) {
    if (/^\s+$/.test(word)) {
      refs.heroTitle.append(document.createTextNode(word));
      continue;
    }

    const span = document.createElement("span");
    span.className = "hero-word";
    span.textContent = word;
    refs.heroTitle.append(span);
  }

  refs.heroWords = Array.from(refs.heroTitle.querySelectorAll(".hero-word"));
}

function getHeroWords() {
  return refs.heroWords;
}

function refreshLayoutCache({ includeHero = false } = {}) {
  state.layout.introPanelRect = refs.introPanel ? refs.introPanel.getBoundingClientRect() : null;
  state.layout.viewportRect = refs.viewport ? refs.viewport.getBoundingClientRect() : null;

  if (includeHero) {
    state.layout.heroWordRects = getHeroWords().map((word) => word.getBoundingClientRect());
  }
}

function resetRowSurface(row) {
  if (!row.active && !row.spellOverlay) {
    resetBubbleGlyphs(row);
    return;
  }

  row.element.classList.remove(
    "is-active-surface",
    "is-sliced",
    "is-spellbound",
    "is-slammed",
  );
  row.element.style.setProperty("--row-shift-x", "0px");
  row.element.style.setProperty("--row-shift-y", "0px");
  row.element.style.setProperty("--row-rotate", "0deg");
  row.element.style.setProperty("--row-scale", "1");
  row.element.style.setProperty("--row-glow", "0");
  row.element.style.setProperty("--row-hue-shift", "0deg");
  row.element.style.setProperty("--row-slice", "0");
  row.element.style.setProperty("--row-slice-angle", "0deg");
  row.element.style.setProperty("--row-spell", "0");
  row.element.style.setProperty("--row-spell-hue", "96");
  row.element.style.setProperty("--row-wave", "0");

  if (row.bubbleContent && row.spellOverlay) {
    row.bubbleContent.setAttribute("data-spell-overlay", "");
  }

  resetBubbleGlyphs(row);
  row.active = false;
  row.spellOverlay = "";
}

function resetHeroWords() {
  for (const word of getHeroWords()) {
    word.style.setProperty("--word-shift-x", "0px");
    word.style.setProperty("--word-shift-y", "0px");
    word.style.setProperty("--word-rotate", "0deg");
    word.style.setProperty("--word-skew", "0deg");
    word.style.setProperty("--word-scale", "1");
    word.style.setProperty("--word-hue", "34");
  }
}

function applyArtifactMode(modeKey) {
  const mode = ARTIFACT_MODES[modeKey] ?? ARTIFACT_MODES.off;
  state.pointer.mode = mode.key;

  refs.body.dataset.cursorMode = mode.key;
  refs.body.dataset.artifacts = mode.enabled ? "on" : "off";
  refs.cursorOrb?.setAttribute("data-mode", mode.key);

  if (refs.cursorGlyph) {
    refs.cursorGlyph.innerHTML = mode.icon;
  }
  if (refs.cursorLabel) {
    refs.cursorLabel.textContent = mode.badge;
  }
  if (refs.modeCopy) {
    refs.modeCopy.textContent = mode.description;
  }
  if (refs.orbitNote) {
    refs.orbitNote.textContent = mode.note;
  }
  if (refs.stageHint) {
    refs.stageHint.textContent = mode.stageHint;
  }

  for (const button of document.querySelectorAll("[data-cursor-mode]")) {
    button.classList.toggle("is-active", button.dataset.cursorMode === mode.key);
  }

  if (!mode.enabled) {
    refs.cursorOrb?.classList.remove("is-visible");
    resetHeroWords();
  } else if (state.pointer.active) {
    refs.cursorOrb?.classList.add("is-visible");
  }

  state.surfaceResetDone = false;
  state.surfaceDirty = true;
  state.effects.slash.until = 0;
  state.effects.spell.until = 0;
  state.effects.shockwave.until = 0;
  if (refs.spellLabel) {
    refs.spellLabel.textContent = "AETHER LIFT";
  }

  updateStats();
}

function triggerArtifactBurst(multiplier = 1) {
  const mode = getArtifactMode();
  if (!mode.enabled) {
    return;
  }

  state.pointer.burstUntil = state.pointer.now + 260 * multiplier;
}

function triggerSwordSlash(x, y, angle, speed) {
  const duration = 260;
  state.effects.slash.startedAt = state.pointer.now;
  state.effects.slash.duration = duration;
  state.effects.slash.until = state.pointer.now + duration;
  state.effects.slash.cooldownUntil = state.pointer.now + 170;
  state.effects.slash.x = x;
  state.effects.slash.y = y;
  state.effects.slash.angle = angle;
  state.effects.slash.length = clamp(180 + speed * 160, 190, 420);
  triggerArtifactBurst(1.25);
}

function triggerStaffSpell(x, y, spell) {
  const duration = 780;
  state.effects.spell.startedAt = state.pointer.now;
  state.effects.spell.duration = duration;
  state.effects.spell.until = state.pointer.now + duration;
  state.effects.spell.cooldownUntil = state.pointer.now + 560;
  state.effects.spell.x = x;
  state.effects.spell.y = y;
  state.effects.spell.angle = spell.angle;
  state.effects.spell.name = spell.name;
  state.effects.spell.seed = spell.seed;
  state.effects.spell.hue = spell.hue;
  if (refs.spellLabel) {
    refs.spellLabel.textContent = spell.name;
  }
  triggerArtifactBurst(1.18);
}

function triggerShockwave(x, y, power = 1) {
  const duration = 560;
  state.effects.shockwave.startedAt = state.pointer.now;
  state.effects.shockwave.duration = duration;
  state.effects.shockwave.until = state.pointer.now + duration;
  state.effects.shockwave.cooldownUntil = state.pointer.now + 260;
  state.effects.shockwave.x = x;
  state.effects.shockwave.y = y;
  state.effects.shockwave.power = power;
  triggerArtifactBurst(1.4);
}

function updatePointerField() {
  const rootStyle = document.documentElement.style;
  const mode = getArtifactMode();
  const burst = clamp((state.pointer.burstUntil - state.pointer.now) / 260, 0, 1);
  const baseHue = mod(
    (state.pointer.currentX / Math.max(window.innerWidth, 1)) * 220 +
      (state.pointer.currentY / Math.max(window.innerHeight, 1)) * 130 +
      mode.hueOffset +
      burst * 22,
    360,
  );
  const velocityX = state.pointer.targetX - state.pointer.currentX;
  const velocityY = state.pointer.targetY - state.pointer.currentY;
  const tilt = clamp(velocityX * 0.08 + velocityY * 0.03, -16, 16);
  const normX = state.pointer.currentX / Math.max(window.innerWidth, 1) - 0.5;
  const normY = state.pointer.currentY / Math.max(window.innerHeight, 1) - 0.5;

  rootStyle.setProperty("--pointer-x", `${state.pointer.currentX}px`);
  rootStyle.setProperty("--pointer-y", `${state.pointer.currentY}px`);
  rootStyle.setProperty("--artifact-hue", `${baseHue.toFixed(2)}`);
  rootStyle.setProperty("--cursor-burst", burst.toFixed(3));
  rootStyle.setProperty("--cursor-tilt", `${tilt.toFixed(2)}deg`);
  rootStyle.setProperty("--cursor-scale", `${mode.scale}`);
  rootStyle.setProperty("--frame-tilt-y", `${clamp(normX * 2.2, -2.2, 2.2).toFixed(2)}deg`);
  rootStyle.setProperty("--frame-tilt-x", `${clamp(-normY * 1.6, -1.6, 1.6).toFixed(2)}deg`);
  rootStyle.setProperty("--frame-shift-x", `${(normX * 10).toFixed(2)}px`);
  rootStyle.setProperty("--frame-shift-y", `${(normY * 8).toFixed(2)}px`);
  state.artifactHue = baseHue;

  if (state.layout.introPanelRect) {
    const rect = state.layout.introPanelRect;
    const panelX = clamp(((state.pointer.currentX - rect.left) / rect.width) * 100, 0, 100);
    const panelY = clamp(((state.pointer.currentY - rect.top) / rect.height) * 100, 0, 100);
    const inside =
      state.pointer.currentX >= rect.left &&
      state.pointer.currentX <= rect.right &&
      state.pointer.currentY >= rect.top &&
      state.pointer.currentY <= rect.bottom;

    rootStyle.setProperty("--panel-pointer-x", `${panelX}%`);
    rootStyle.setProperty("--panel-pointer-y", `${panelY}%`);
    rootStyle.setProperty(
      "--panel-glow-opacity",
      inside ? `${mode.panelGlow + burst * 0.1}` : `${mode.panelGlow * 0.42}`,
    );
  }

  if (state.layout.viewportRect) {
    const rect = state.layout.viewportRect;
    const inside =
      state.pointer.currentX >= rect.left &&
      state.pointer.currentX <= rect.right &&
      state.pointer.currentY >= rect.top &&
      state.pointer.currentY <= rect.bottom;
    const viewportX = clamp(((state.pointer.currentX - rect.left) / rect.width) * 100, 0, 100);
    const viewportY = clamp(((state.pointer.currentY - rect.top) / rect.height) * 100, 0, 100);

    rootStyle.setProperty("--viewport-spot-x", `${viewportX}%`);
    rootStyle.setProperty("--viewport-spot-y", `${viewportY}%`);
    rootStyle.setProperty(
      "--viewport-spot-opacity",
      mode.enabled && inside ? `${0.22 + burst * 0.14}` : "0",
    );
  }

  const slashStrength = getEffectStrength(state.effects.slash);
  const spellStrength = getEffectStrength(state.effects.spell);
  const spellProgress = getEffectProgress(state.effects.spell);
  const shockStrength = getEffectStrength(state.effects.shockwave);
  const shockProgress = getEffectProgress(state.effects.shockwave);
  const shockRadius =
    26 + shockProgress * (460 + state.effects.shockwave.power * 80);

  rootStyle.setProperty("--slash-x", `${state.effects.slash.x}px`);
  rootStyle.setProperty("--slash-y", `${state.effects.slash.y}px`);
  rootStyle.setProperty("--slash-angle", `${state.effects.slash.angle.toFixed(2)}deg`);
  rootStyle.setProperty("--slash-length", `${state.effects.slash.length.toFixed(2)}px`);
  rootStyle.setProperty("--slash-opacity", `${slashStrength.toFixed(3)}`);
  rootStyle.setProperty("--spell-x", `${state.effects.spell.x}px`);
  rootStyle.setProperty("--spell-y", `${state.effects.spell.y}px`);
  rootStyle.setProperty("--spell-angle", `${state.effects.spell.angle.toFixed(2)}deg`);
  rootStyle.setProperty("--spell-opacity", `${spellStrength.toFixed(3)}`);
  rootStyle.setProperty("--spell-scale", `${(0.84 + spellProgress * 1.3).toFixed(3)}`);
  rootStyle.setProperty("--spell-hue", `${state.effects.spell.hue}`);
  rootStyle.setProperty("--shock-x", `${state.effects.shockwave.x}px`);
  rootStyle.setProperty("--shock-y", `${state.effects.shockwave.y}px`);
  rootStyle.setProperty("--shock-radius", `${shockRadius.toFixed(2)}px`);
  rootStyle.setProperty("--shock-opacity", `${shockStrength.toFixed(3)}`);
  rootStyle.setProperty("--frame-glow-opacity", `${mode.enabled ? 0.34 + burst * 0.08 : 0.16}`);

  refs.slashEffect?.classList.toggle("is-visible", slashStrength > 0.02);
  refs.spellEffect?.classList.toggle("is-visible", spellStrength > 0.02);
  refs.shockwaveEffect?.classList.toggle("is-visible", shockStrength > 0.02);
}

function updateMessageSurface() {
  const mode = getArtifactMode();
  const rows = state.visibleRows;
  const slashStrength = getEffectStrength(state.effects.slash);
  const spellStrength = getEffectStrength(state.effects.spell);
  const shockStrength = getEffectStrength(state.effects.shockwave);
  const slashAngleRad = (state.effects.slash.angle * Math.PI) / 180;
  const slashHalfLength = state.effects.slash.length * 0.5;
  const slashX1 = state.effects.slash.x - Math.cos(slashAngleRad) * slashHalfLength;
  const slashY1 = state.effects.slash.y - Math.sin(slashAngleRad) * slashHalfLength;
  const slashX2 = state.effects.slash.x + Math.cos(slashAngleRad) * slashHalfLength;
  const slashY2 = state.effects.slash.y + Math.sin(slashAngleRad) * slashHalfLength;
  const shockProgress = getEffectProgress(state.effects.shockwave);
  const shockRadius =
    26 + shockProgress * (460 + state.effects.shockwave.power * 80);

  if (rows.length === 0) {
    return;
  }

  if (!mode.enabled) {
    if (state.surfaceResetDone) {
      return;
    }

    for (const row of rows) {
      resetRowSurface(row);
    }
    state.surfaceResetDone = true;
    return;
  }

  state.surfaceResetDone = false;
  const burst = clamp((state.pointer.burstUntil - state.pointer.now) / 260, 0, 1);
  const viewportRect = state.layout.viewportRect;
  const viewportWidth = refs.viewport?.clientWidth || state.frameWidth;
  const viewportScrollTop = refs.viewport?.scrollTop || 0;
  const bubbleInsetX = 36;
  const bubbleInsetY = 18;

  for (const row of rows) {
    const message = state.messages[row.messageIndex];
    if (!viewportRect) {
      continue;
    }

    const centerX =
      viewportRect.left +
      (row.role === "user"
        ? viewportWidth - bubbleInsetX - row.measurement.bubbleWidth / 2
        : bubbleInsetX + row.measurement.bubbleWidth / 2);
    const centerY =
      viewportRect.top +
      bubbleInsetY +
      row.offsetY -
      viewportScrollTop +
      row.measurement.outerHeight * 0.5;
    const deltaX = state.pointer.currentX - centerX;
    const deltaY = state.pointer.currentY - centerY;
    const distance = Math.hypot(deltaX, deltaY);
    const influence = clamp(1 - distance / 420, 0, 1);
    const unitX = distance > 0 ? deltaX / distance : 0;
    const unitY = distance > 0 ? deltaY / distance : -1;

    let shiftX = deltaX * 0.016 * influence;
    let shiftY = deltaY * 0.022 * influence;
    let rotate = clamp(deltaX * 0.012, -3.2, 3.2) * influence;
    let scale = 1 + influence * 0.018 + burst * 0.012;
    let glow = influence * 0.5 + burst * 0.18;
    let hueShift = (influence * 18 + burst * 22) * (row.role === "user" ? 1 : -0.5);
    let sliceStrength = 0;
    let spellAmount = 0;
    let waveAmount = 0;

    if (mode.key === "orb") {
      const angle = Math.atan2(deltaY, deltaX);
      const orbital = (18 + burst * 16) * influence;
      shiftX = deltaX * 0.028 * influence - Math.sin(angle) * orbital;
      shiftY = deltaY * 0.028 * influence + Math.cos(angle) * orbital;
      rotate = clamp(Math.cos(angle + state.pointer.now / 360) * 8, -8, 8) * influence;
      scale = 1 + influence * 0.034 + burst * 0.02;
      glow = influence * 0.7 + burst * 0.24;
      hueShift = influence * 28;
    }

    if (mode.key === "sword") {
      shiftX = deltaX * 0.02 * influence;
      shiftY = -Math.abs(deltaY) * 0.014 * influence;
      rotate = clamp(deltaX * 0.018 - deltaY * 0.012, -5.5, 5.5) * influence;
      scale = 1 + influence * 0.02 + burst * 0.018;
      glow = influence * 0.32 + burst * 0.22;
      hueShift = influence * 10;

      if (slashStrength > 0.01) {
        const slashHit = pointToSegmentDistance(centerX, centerY, slashX1, slashY1, slashX2, slashY2);
        sliceStrength = clamp(1 - slashHit.distance / 170, 0, 1) * slashStrength;
        shiftX += Math.cos(slashAngleRad) * 34 * sliceStrength * slashHit.side;
        shiftY += Math.sin(slashAngleRad) * 22 * sliceStrength * slashHit.side;
        rotate += slashHit.side * sliceStrength * 13;
        scale += sliceStrength * 0.05;
        glow += sliceStrength * 1.2;
      }
    }

    if (mode.key === "staff") {
      shiftX = deltaX * 0.012 * influence + Math.sin(state.pointer.now / 300 + centerY * 0.01) * 2.8 * influence;
      shiftY = deltaY * 0.02 * influence + Math.cos(state.pointer.now / 260 + centerX * 0.01) * 3.4 * influence;
      rotate = clamp(deltaX * 0.008, -2.6, 2.6) * influence;
      scale = 1 + influence * 0.016 + burst * 0.014;
      glow = influence * 0.56 + burst * 0.2;
      hueShift = 18 + influence * 24;

      if (spellStrength > 0.01) {
        const spellDistance = Math.hypot(centerX - state.effects.spell.x, centerY - state.effects.spell.y);
        spellAmount = clamp(1 - spellDistance / 540, 0, 1) * spellStrength;
        shiftX += Math.cos(state.pointer.now / 210 + row.messageIndex * 0.4) * 7 * spellAmount;
        shiftY += Math.sin(state.pointer.now / 180 + row.messageIndex * 0.3) * 14 * spellAmount;
        rotate += Math.sin(state.pointer.now / 240 + row.messageIndex) * 3.2 * spellAmount;
        scale += spellAmount * 0.06;
        glow += spellAmount * 1.1;
        hueShift += spellAmount * 28;
      }
    }

    if (mode.key === "fist") {
      shiftX = -deltaX * 0.024 * influence;
      shiftY = -deltaY * 0.026 * influence - burst * 4.4;
      rotate = clamp((deltaX - deltaY) * 0.012, -4.8, 4.8) * influence;
      scale = 1 + influence * 0.014 + burst * 0.05;
      glow = influence * 0.36 + burst * 0.34;
      hueShift = -8 - influence * 12;

      if (shockStrength > 0.01) {
        const shockDistance = Math.hypot(
          centerX - state.effects.shockwave.x,
          centerY - state.effects.shockwave.y,
        );
        const ringDistance = Math.abs(shockDistance - shockRadius);
        waveAmount = clamp(1 - ringDistance / 130, 0, 1) * shockStrength;
        shiftX += unitX * 20 * waveAmount;
        shiftY += unitY * 28 * waveAmount + waveAmount * 18;
        rotate += unitX * 8 * waveAmount;
        scale += waveAmount * 0.08;
        glow += waveAmount * 1.24;
      }
    }

    const proximityThreshold = mode.key === "orb" ? 0.1 : 0.12;
    const shouldAnimate =
      influence > proximityThreshold ||
      sliceStrength > 0.045 ||
      spellAmount > 0.05 ||
      waveAmount > 0.05;

    if (!shouldAnimate) {
      resetRowSurface(row);
      continue;
    }

    row.active = true;
    row.element.classList.add("is-active-surface");
    row.element.classList.toggle("is-sliced", sliceStrength > 0.06);
    row.element.classList.toggle("is-spellbound", spellAmount > 0.08);
    row.element.classList.toggle("is-slammed", waveAmount > 0.08);
    row.element.style.setProperty("--row-shift-x", `${shiftX.toFixed(2)}px`);
    row.element.style.setProperty("--row-shift-y", `${shiftY.toFixed(2)}px`);
    row.element.style.setProperty("--row-rotate", `${rotate.toFixed(2)}deg`);
    row.element.style.setProperty("--row-scale", `${scale.toFixed(3)}`);
    row.element.style.setProperty("--row-glow", `${glow.toFixed(3)}`);
    row.element.style.setProperty("--row-hue-shift", `${hueShift.toFixed(2)}deg`);
    row.element.style.setProperty("--row-slice", `${sliceStrength.toFixed(3)}`);
    row.element.style.setProperty("--row-slice-angle", `${state.effects.slash.angle.toFixed(2)}deg`);
    row.element.style.setProperty("--row-spell", `${spellAmount.toFixed(3)}`);
    row.element.style.setProperty("--row-spell-hue", `${state.effects.spell.hue}`);
    row.element.style.setProperty("--row-wave", `${waveAmount.toFixed(3)}`);
    updateBubbleGlyphs(row, mode, influence, sliceStrength, spellAmount, waveAmount);

    if (row.bubbleContent) {
      if (message && spellAmount > 0.08) {
        const overlay = buildSpellOverlay(message.content, state.effects.spell.seed);
        if (row.spellOverlay !== overlay) {
          row.bubbleContent.setAttribute("data-spell-overlay", overlay);
          row.spellOverlay = overlay;
        }
      } else {
        if (row.spellOverlay) {
          row.bubbleContent.setAttribute("data-spell-overlay", "");
          row.spellOverlay = "";
        }
      }
    }
  }
}

function updateHeroResponse() {
  const mode = getArtifactMode();
  const words = getHeroWords();
  const heroWordRects = state.layout.heroWordRects;

  if (!mode.enabled || words.length === 0 || heroWordRects.length !== words.length) {
    return;
  }

  const burst = clamp((state.pointer.burstUntil - state.pointer.now) / 260, 0, 1);
  const baseHue = state.artifactHue;

  words.forEach((word, index) => {
    const rect = heroWordRects[index];
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = state.pointer.currentX - centerX;
    const deltaY = state.pointer.currentY - centerY;
    const distance = Math.hypot(deltaX, deltaY);
    const influence = clamp(1 - distance / mode.influenceRadius, 0, 1);

    let shiftX = deltaX * 0.085 * influence;
    let shiftY = deltaY * 0.07 * influence;
    let rotate = clamp(deltaX * 0.015, -8, 8) * influence;
    let skew = 0;
    let scale = 1 + influence * 0.08 + burst * 0.04;
    let wordHue = mod(
      baseHue +
        index * mode.hueSpread +
        influence * 54 +
        Math.sin(state.pointer.now / 260 + index) * 8,
      360,
    );

    if (mode.key === "orb") {
      const angle = Math.atan2(deltaY, deltaX);
      const orbital = (14 + burst * 12) * influence;
      shiftX = deltaX * 0.035 * influence - Math.sin(angle) * orbital;
      shiftY = deltaY * 0.04 * influence + Math.cos(angle) * orbital;
      rotate = clamp(deltaX * 0.01 + Math.cos(state.pointer.now / 220 + index) * 6, -10, 10) * influence;
      skew = clamp(Math.sin(angle + state.pointer.now / 460) * 8, -8, 8) * influence;
      scale = 1 + influence * 0.1 + burst * 0.06;
      wordHue = mod(baseHue + index * 28 + influence * 76, 360);
    }

    if (mode.key === "sword") {
      shiftX = deltaX * 0.13 * influence;
      shiftY = deltaY * 0.03 * influence - Math.abs(deltaY) * 0.018 * influence;
      rotate = clamp(deltaX * 0.03 - deltaY * 0.012, -16, 16) * influence;
      skew = clamp(deltaX * 0.024, -14, 14) * influence;
      scale = 1 + influence * 0.1 + burst * 0.08;
      wordHue = mod(baseHue + index * 16 + influence * 30, 360);
    }

    if (mode.key === "staff") {
      const spellStrength = getEffectStrength(state.effects.spell);
      shiftX =
        deltaX * 0.05 * influence +
        Math.cos(state.pointer.now / 340 + index * 0.8) * 4 * influence;
      shiftY =
        deltaY * 0.08 * influence +
        Math.sin(state.pointer.now / 240 + index * 0.55) * 10 * influence;
      rotate = clamp(deltaX * 0.01, -6, 6) * influence;
      scale =
        1 +
        influence * 0.06 +
        Math.sin(state.pointer.now / 420 + index * 0.4) * 0.02 * influence +
        burst * 0.05 +
        spellStrength * 0.08;
      wordHue = mod(baseHue + index * 34 + influence * 42 + state.effects.spell.hue * spellStrength * 0.06, 360);
    }

    if (mode.key === "fist") {
      const shockStrength = getEffectStrength(state.effects.shockwave);
      shiftX = -deltaX * 0.12 * influence;
      shiftY = -deltaY * 0.1 * influence - burst * 6 - shockStrength * 14;
      rotate = clamp((deltaX - deltaY) * 0.014, -11, 11) * influence;
      skew = clamp(-deltaX * 0.02, -12, 12) * influence;
      scale = 1 + influence * 0.04 + burst * 0.16 + shockStrength * 0.08;
      wordHue = mod(baseHue + index * 14 + influence * 22, 360);
    }

    word.style.setProperty("--word-shift-x", `${shiftX.toFixed(2)}px`);
    word.style.setProperty("--word-shift-y", `${shiftY.toFixed(2)}px`);
    word.style.setProperty("--word-rotate", `${rotate.toFixed(2)}deg`);
    word.style.setProperty("--word-skew", `${skew.toFixed(2)}deg`);
    word.style.setProperty("--word-scale", `${scale.toFixed(3)}`);
    word.style.setProperty("--word-hue", `${wordHue.toFixed(2)}`);
  });
}

function updateAmbientStage() {
  const t = state.pointer.now;
  const px = state.pointer.currentX / Math.max(window.innerWidth, 1) - 0.5;
  const py = state.pointer.currentY / Math.max(window.innerHeight, 1) - 0.5;

  AMBIENT_ORBS.forEach((orb, index) => {
    const element = refs.stageOrbs[index];
    if (!element) {
      return;
    }

    const x =
      orb.baseX +
      Math.sin(t * orb.speedX + index * 0.9) * orb.ampX +
      px * (6 + index * 2);
    const y =
      orb.baseY +
      Math.cos(t * orb.speedY + index * 1.1) * orb.ampY +
      py * (8 + index * 2);
    const scale = orb.scale + Math.sin(t * 0.00014 + index) * 0.08;

    element.style.transform = `translate3d(${x.toFixed(2)}vw, ${y.toFixed(2)}vh, 0) scale(${scale.toFixed(3)})`;
  });
}

function startMotionLoop() {
  if (!state.pointer.interactive || state.motionStarted) {
    return;
  }

  state.motionStarted = true;

  const tick = (timestamp) => {
    state.pointer.now = timestamp;
    state.pointer.currentX += (state.pointer.targetX - state.pointer.currentX) * 0.16;
    state.pointer.currentY += (state.pointer.targetY - state.pointer.currentY) * 0.16;
    const pointerSettled =
      Math.abs(state.pointer.targetX - state.pointer.currentX) < 0.12 &&
      Math.abs(state.pointer.targetY - state.pointer.currentY) < 0.12;
    const effectsActive =
      state.effects.slash.until > timestamp ||
      state.effects.spell.until > timestamp ||
      state.effects.shockwave.until > timestamp;
    const surfaceActive =
      getArtifactMode().enabled && (!pointerSettled || effectsActive || state.surfaceDirty);
    const pointerFrameNeeded = surfaceActive || effectsActive || state.lastEffectsActive;

    if (pointerFrameNeeded) {
      updatePointerField();
    }
    updateAmbientStage();
    if (surfaceActive) {
      updateHeroResponse();
      updateMessageSurface();
      state.surfaceDirty = false;
    } else if (!getArtifactMode().enabled) {
      updateMessageSurface();
    }
    state.lastEffectsActive = effectsActive;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function buildConversation(count) {
  const random = mulberry32(20260331 + count);
  const messages = [];

  for (let index = 0; index < count; index += 1) {
    const role = index % 3 === 0 ? "user" : "assistant";
    const segments = [
      pick(random, copyBank.intros),
      pick(random, copyBank.details),
      pick(random, copyBank.tails),
    ];

    if (random() > 0.6) {
      segments.splice(2, 0, pick(random, copyBank.multiline));
    }

    if (role === "user") {
      segments.length = Math.max(1, Math.floor(random() * 2) + 1);
    }

    const separator = random() > 0.54 ? "\n\n" : " ";
    const content = segments.join(separator);

    messages.push({
      id: `m${state.nextId++}`,
      role,
      content,
      status: "complete",
      time: nowTime(index - count),
    });
  }

  return messages;
}

function makeAssistantReply(userText) {
  return [
    "좋습니다. 지금 입력하신 질문을 기준으로 보면, FlowChat의 핵심은 React보다 아래 계층의 높이 계산 엔진을 먼저 안정화하는 쪽입니다.",
    `사용자 질문 요약: "${userText.trim()}"`,
    "이번 스테이지는 단순히 예쁜 채팅 창이 아니라, Pretext 기반 shrinkwrap과 virtualization이 실제로 어떻게 보이는지를 데모하는 역할을 합니다.",
    "따라서 다음 순서가 적절합니다.",
    "1. 메시지 단위 prepare 캐시",
    "2. width 변경 시 layout 재호출",
    "3. walkLineRanges 기반 bubble shrinkwrap",
    "4. prefix sum 기반 visible range 계산",
    "5. 마지막에 React 컴포넌트 래핑",
  ].join("\n\n");
}

function getViewportContentWidth() {
  const raw = refs.viewport?.clientWidth || state.frameWidth;
  return Math.max(280, raw - 36);
}

function getMaxTextWidth(role) {
  const viewportWidth = getViewportContentWidth();
  const ratio = role === "user" ? 0.72 : role === "system" ? 0.76 : 0.8;
  const bubbleOuterMax = clamp(viewportWidth * ratio, 220, role === "assistant" ? 620 : 560);
  return Math.max(120, bubbleOuterMax - BUBBLE_PADDING_X);
}

function getMinBubbleOuterWidth(role) {
  if (role === "system") {
    return 188;
  }
  if (role === "assistant") {
    return 172;
  }
  return 148;
}

function estimateFallbackMeasurement(message) {
  const maxTextWidth = getMaxTextWidth(message.role);
  const charsPerLine = Math.max(10, Math.floor(maxTextWidth / 8.8));
  const lines = Math.max(
    1,
    message.content
      .split("\n")
      .reduce((sum, segment) => sum + Math.max(1, Math.ceil(segment.length / charsPerLine)), 0),
  );
  const contentHeight = lines * MESSAGE_LINE_HEIGHT;
  const bubbleWidth = clamp(
    Math.min(maxTextWidth, Math.max(EMPTY_TEXT_WIDTH, Math.min(message.content.length * 8.2, maxTextWidth))) +
      BUBBLE_PADDING_X,
    getMinBubbleOuterWidth(message.role),
    maxTextWidth + BUBBLE_PADDING_X,
  );

  return {
    lineCount: lines,
    contentHeight,
    outerHeight: Math.ceil(
      contentHeight +
        BUBBLE_PADDING_Y +
        MESSAGE_GAP +
        (message.status === "streaming" ? 6 : 0),
    ),
    bubbleWidth,
    maxBubbleWidth: Math.ceil(maxTextWidth + BUBBLE_PADDING_X),
    shrinkTextWidth: Math.max(EMPTY_TEXT_WIDTH, bubbleWidth - BUBBLE_PADDING_X),
    slack: Math.max(0, Math.ceil(maxTextWidth + BUBBLE_PADDING_X - bubbleWidth)),
  };
}

function ensurePrepared(message) {
  if (!state.pretext) {
    return null;
  }

  const cached = state.prepared.get(message.id);
  if (cached && cached.content === message.content) {
    return cached;
  }

  const prepareFn =
    typeof state.pretext.prepareWithSegments === "function"
      ? state.pretext.prepareWithSegments
      : state.pretext.prepare;
  const prepared = prepareFn(message.content, MESSAGE_FONT, {
    whiteSpace: "pre-wrap",
  });
  const nextEntry = {
    content: message.content,
    prepared,
  };

  state.prepared.set(message.id, nextEntry);
  return nextEntry;
}

function resolveShrinkwrapWidth(prepared, maxTextWidth, baseLineCount) {
  if (!state.pretext || typeof state.pretext.walkLineRanges !== "function") {
    return maxTextWidth;
  }

  let widest = 0;
  state.pretext.walkLineRanges(prepared, maxTextWidth, (line) => {
    widest = Math.max(widest, line.width);
  });

  const candidate = clamp(Math.ceil(widest + 1), 120, maxTextWidth);
  const candidateLayout = state.pretext.layout(prepared, candidate, MESSAGE_LINE_HEIGHT);

  if (candidateLayout.lineCount === baseLineCount) {
    return candidate;
  }

  return maxTextWidth;
}

function measureMessage(message) {
  if (!state.pretext) {
    return estimateFallbackMeasurement(message);
  }

  const preparedEntry = ensurePrepared(message);
  if (!preparedEntry) {
    return estimateFallbackMeasurement(message);
  }

  const maxTextWidth = getMaxTextWidth(message.role);
  const initialLayout = state.pretext.layout(
    preparedEntry.prepared,
    maxTextWidth,
    MESSAGE_LINE_HEIGHT,
  );
  const initialLineCount = Math.max(1, initialLayout.lineCount);
  const shrinkTextWidth =
    message.content.trim() === ""
      ? EMPTY_TEXT_WIDTH
      : resolveShrinkwrapWidth(preparedEntry.prepared, maxTextWidth, initialLineCount);
  const shrinkLayout = state.pretext.layout(
    preparedEntry.prepared,
    shrinkTextWidth,
    MESSAGE_LINE_HEIGHT,
  );
  const lineCount = Math.max(1, shrinkLayout.lineCount || initialLineCount);
  const contentHeight = Math.max(MESSAGE_LINE_HEIGHT, shrinkLayout.height || lineCount * MESSAGE_LINE_HEIGHT);
  const maxBubbleWidth = Math.ceil(maxTextWidth + BUBBLE_PADDING_X);
  const bubbleWidth = clamp(
    Math.ceil(shrinkTextWidth + BUBBLE_PADDING_X),
    getMinBubbleOuterWidth(message.role),
    maxBubbleWidth,
  );

  return {
    lineCount,
    contentHeight,
    outerHeight: Math.ceil(
      contentHeight +
        BUBBLE_PADDING_Y +
        MESSAGE_GAP +
        (message.status === "streaming" ? 6 : 0),
    ),
    bubbleWidth,
    maxBubbleWidth,
    shrinkTextWidth,
    slack: Math.max(0, maxBubbleWidth - bubbleWidth),
  };
}

function recomputeShrinkStats() {
  if (state.measurements.length === 0) {
    state.shrinkPercent = 0;
    return;
  }

  const totalMax = state.measurements.reduce(
    (sum, measurement) => sum + measurement.maxBubbleWidth,
    0,
  );
  const totalActual = state.measurements.reduce(
    (sum, measurement) => sum + measurement.bubbleWidth,
    0,
  );

  state.shrinkPercent =
    totalMax === 0 ? 0 : Math.max(0, Math.round((1 - totalActual / totalMax) * 100));
}

function rebuildOffsets(startIndex = 0) {
  const count = state.heights.length;
  if (state.offsets.length !== count + 1) {
    state.offsets = new Array(count + 1).fill(0);
  }

  const safeStart = Math.max(0, startIndex);
  if (safeStart === 0) {
    state.offsets[0] = 0;
  }

  for (let index = safeStart; index < count; index += 1) {
    state.offsets[index + 1] = state.offsets[index] + state.heights[index];
  }
}

function measureAllMessages() {
  const startedAt = performance.now();
  state.measurements = state.messages.map((message) => measureMessage(message));
  state.heights = state.measurements.map((measurement) => measurement.outerHeight);
  rebuildOffsets(0);
  recomputeShrinkStats();
  state.lastMeasureMs = performance.now() - startedAt;
}

function remeasureFrom(index) {
  const startedAt = performance.now();
  state.measurements[index] = measureMessage(state.messages[index]);
  state.heights[index] = state.measurements[index].outerHeight;
  rebuildOffsets(index);
  recomputeShrinkStats();
  state.lastMeasureMs = performance.now() - startedAt;
}

function findIndexAtOffset(offset) {
  let low = 0;
  let high = state.messages.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if ((state.offsets[mid + 1] ?? 0) <= offset) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return Math.min(low, Math.max(0, state.messages.length - 1));
}

function getVisibleRange() {
  if (state.messages.length === 0) {
    return { start: 0, end: 0 };
  }

  const scrollTop = refs.viewport.scrollTop;
  const viewportHeight = refs.viewport.clientHeight;
  const totalHeight = state.offsets[state.offsets.length - 1];
  const startOffset = Math.max(0, scrollTop - OVERSCAN_PX);
  const endOffset = Math.min(totalHeight, scrollTop + viewportHeight + OVERSCAN_PX);
  const start = findIndexAtOffset(startOffset);
  const end = Math.min(state.messages.length, findIndexAtOffset(endOffset) + 2);

  return { start, end };
}

function updateAnchorState() {
  const remaining =
    refs.viewport.scrollHeight - refs.viewport.clientHeight - refs.viewport.scrollTop;
  state.anchor = remaining < 40;
}

function updateStats() {
  refs.messageCount.textContent = formatNumber(state.messages.length);
  refs.renderedCount.textContent = formatNumber(state.renderedCount);
  refs.totalHeight.textContent = `${formatNumber(Math.round(state.offsets.at(-1) || 0))}px`;
  refs.measureTime.textContent = `${state.lastMeasureMs.toFixed(2)}ms`;
  refs.anchorState.textContent = state.anchor ? "ON" : "OFF";
  refs.artifactState.textContent = getArtifactMode().badge;
  refs.shrinkState.textContent = `${state.shrinkPercent}%`;
}

function renderVisibleMessages() {
  const { start, end } = getVisibleRange();
  const fragment = document.createDocumentFragment();
  const visibleRows = [];

  for (let index = start; index < end; index += 1) {
    const message = state.messages[index];
    const measurement = state.measurements[index] ?? estimateFallbackMeasurement(message);
    const row = document.createElement("article");
    row.className = `message-row ${message.role}`;
    row.dataset.index = `${index}`;
    row.style.setProperty("--row-offset-y", `${state.offsets[index]}px`);

    const timeMeta =
      message.status === "streaming"
        ? '<span class="stream-dot" aria-hidden="true"></span><span>streaming</span>'
        : `<span>${message.time}</span>`;

    row.innerHTML = [
      `<div class="bubble" style="width:${measurement.bubbleWidth}px">`,
      '<div class="bubble-meta">',
      `<span>${message.role}</span>`,
      timeMeta,
      "</div>",
      '<p class="bubble-content" data-spell-overlay="">',
      '<span class="bubble-text"></span>',
      "</p>",
      "</div>",
    ].join("");

    const bubbleText = row.querySelector(".bubble-text");
    if (bubbleText) {
      bubbleText.textContent = message.content;
    }

    visibleRows.push({
      element: row,
      bubbleContent: row.querySelector(".bubble-content"),
      bubbleText,
      messageIndex: index,
      messageContent: message.content,
      role: message.role,
      measurement,
      offsetY: state.offsets[index],
      active: false,
      spellOverlay: "",
      charsActive: false,
      charNodes: null,
      charText: null,
    });
    fragment.appendChild(row);
  }

  refs.spacer.replaceChildren(fragment);
  refs.spacer.style.height = `${state.offsets.at(-1) || 0}px`;
  state.visibleRows = visibleRows;
  state.surfaceDirty = true;
  refreshLayoutCache();
  state.renderedCount = end - start;
  updateStats();
}

let renderQueued = false;

function queueRender() {
  if (renderQueued) {
    return;
  }

  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    renderVisibleMessages();
  });
}

function scrollToBottom(behavior = "auto") {
  refs.viewport.scrollTo({
    top: refs.viewport.scrollHeight,
    behavior,
  });
}

function refreshAfterFullMeasure({ scrollBottom = false } = {}) {
  measureAllMessages();
  queueRender();

  if (scrollBottom || state.anchor) {
    requestAnimationFrame(() => scrollToBottom());
  }
}

function setFrameWidth(nextWidth) {
  state.frameWidth = nextWidth;
  refs.chatFrame.style.setProperty("--chat-frame-width", `${nextWidth}px`);
  refs.widthValue.textContent = `${nextWidth}px`;
  refreshAfterFullMeasure();
}

function seedConversation(count) {
  stopStreaming();
  state.messages = buildConversation(count);
  state.prepared.clear();
  refs.statusBadge.textContent = "seeded";
  refreshAfterFullMeasure({ scrollBottom: true });
}

function appendMessage(message) {
  state.messages.push(message);
  const measurement = measureMessage(message);
  state.measurements.push(measurement);
  state.heights.push(measurement.outerHeight);
  rebuildOffsets(state.messages.length - 1);
  recomputeShrinkStats();
  queueRender();

  if (state.anchor) {
    requestAnimationFrame(() => scrollToBottom("smooth"));
  }
}

function updateMessageContent(messageId, nextContent, nextStatus = "streaming") {
  const index = state.messages.findIndex((message) => message.id === messageId);
  if (index < 0) {
    return;
  }

  state.messages[index] = {
    ...state.messages[index],
    content: nextContent,
    status: nextStatus,
  };
  state.prepared.delete(messageId);
  remeasureFrom(index);
  queueRender();

  if (state.anchor) {
    requestAnimationFrame(() => scrollToBottom());
  }
}

function stopStreaming() {
  if (state.streamTimer !== null) {
    clearInterval(state.streamTimer);
    state.streamTimer = null;
  }

  refs.streamButton.disabled = false;
  refs.streamButton.textContent = "스트리밍 데모 시작";
}

function startStreaming(customPrompt) {
  stopStreaming();
  refs.statusBadge.textContent = "streaming";
  refs.streamButton.disabled = true;
  refs.streamButton.textContent = "스트리밍 중...";

  const responseText = customPrompt
    ? makeAssistantReply(customPrompt)
    : [
        "스트리밍 응답 데모를 시작합니다.",
        "지금은 assistant 메시지가 토큰 단위로 길어질 때마다 Pretext가 버블의 높이와 타이트한 폭을 다시 계산하고 있습니다.",
        "사용자가 맨 아래에 있으면 bottom anchor가 유지되고, 위로 읽고 있으면 현재 위치를 지킵니다.",
        "이 흐름을 안정화하면 긴 AI 대화에서도 레이아웃 시프트를 크게 줄일 수 있습니다.",
      ].join("\n\n");

  const tokens = responseText.split(/(\s+)/).filter(Boolean);
  const messageId = `m${state.nextId++}`;

  appendMessage({
    id: messageId,
    role: "assistant",
    content: "",
    status: "streaming",
    time: nowTime(0),
  });

  let tokenIndex = 0;
  state.streamTimer = window.setInterval(() => {
    const token = tokens[tokenIndex];
    tokenIndex += 1;

    const current = state.messages.find((message) => message.id === messageId);
    const nextContent = `${current.content}${token}`;
    const completed = tokenIndex >= tokens.length;

    updateMessageContent(messageId, nextContent, completed ? "complete" : "streaming");

    if (completed) {
      stopStreaming();
      refs.statusBadge.textContent = "ready";
    }
  }, 58);
}

function handleSend() {
  const text = refs.composerInput.value.trim();
  if (!text) {
    refs.composerInput.focus();
    return;
  }

  appendMessage({
    id: `m${state.nextId++}`,
    role: "user",
    content: text,
    status: "complete",
    time: nowTime(0),
  });

  refs.composerInput.value = "";
  refs.statusBadge.textContent = "replying";
  startStreaming(text);
}

function handleArtifactGesture(x, y, dx, dy, dt) {
  const mode = getArtifactMode();
  if (!mode.enabled) {
    return;
  }

  if (dt <= 0) {
    return;
  }

  const speed = Math.hypot(dx, dy) / dt;

  if (
    mode.key === "sword" &&
    state.pointer.now >= state.effects.slash.cooldownUntil &&
    speed > 0.8 &&
    Math.hypot(dx, dy) > 28
  ) {
    triggerSwordSlash(x, y, (Math.atan2(dy, dx) * 180) / Math.PI, speed);
  }

  if (
    mode.key === "staff" &&
    state.pointer.now >= state.effects.spell.cooldownUntil &&
    speed > 0.62
  ) {
    const spell = resolveStaffSpell(dx, dy);
    if (spell) {
      triggerStaffSpell(x, y, spell);
    }
  }
}

function bindPointerEvents() {
  const supportsPointerEvents = "PointerEvent" in window;

  const activatePointer = (x, y, timeStamp = performance.now()) => {
    const previousX = state.pointer.lastSampleX;
    const previousY = state.pointer.lastSampleY;
    const previousAt = state.pointer.lastSampleAt || timeStamp;
    const dx = x - previousX;
    const dy = y - previousY;
    const dt = Math.max(16, timeStamp - previousAt);

    state.pointer.now = Math.max(state.pointer.now, timeStamp);
    state.pointer.targetX = x;
    state.pointer.targetY = y;
    state.pointer.active = true;
    state.pointer.velocityX = dx / dt;
    state.pointer.velocityY = dy / dt;
    state.pointer.speed = Math.hypot(dx, dy) / dt;
    state.pointer.lastSampleX = x;
    state.pointer.lastSampleY = y;
    state.pointer.lastSampleAt = timeStamp;

    handleArtifactGesture(x, y, dx, dy, dt);

    if (getArtifactMode().enabled) {
      refs.cursorOrb?.classList.add("is-visible");
    }
  };

  if (supportsPointerEvents) {
    window.addEventListener("pointermove", (event) => {
      activatePointer(event.clientX, event.clientY, event.timeStamp);
    });
  } else {
    window.addEventListener("mousemove", (event) => {
      activatePointer(event.clientX, event.clientY, event.timeStamp);
    });
  }

  const burstFromPointer = (event) => {
    const mode = getArtifactMode();
    if (!mode.enabled) {
      return;
    }

    state.pointer.now = Math.max(state.pointer.now, event.timeStamp || performance.now());
    if (
      mode.key === "fist" &&
      state.pointer.now >= state.effects.shockwave.cooldownUntil
    ) {
      const slamPower = clamp(
        Math.max(0.8, state.pointer.velocityY * 46 + state.pointer.speed * 28),
        0.9,
        1.7,
      );
      triggerShockwave(event.clientX, event.clientY, slamPower);
    }

    triggerArtifactBurst(mode.key === "fist" ? 1.35 : 1);
  };

  if (supportsPointerEvents) {
    window.addEventListener("pointerdown", burstFromPointer);
  } else {
    window.addEventListener("mousedown", burstFromPointer);
  }

  document.addEventListener("mouseleave", () => {
    refs.cursorOrb?.classList.remove("is-visible");
    state.pointer.active = false;
  });
}

function bindAppEvents() {
  if (state.appEventsBound) {
    return;
  }

  state.appEventsBound = true;

  refs.viewport.addEventListener("scroll", () => {
    updateAnchorState();
    state.surfaceDirty = true;
    queueRender();
  });

  refs.widthSlider.addEventListener("input", (event) => {
    const value = Number(event.currentTarget.value);
    setFrameWidth(value);
  });

  for (const button of document.querySelectorAll("[data-seed-count]")) {
    button.addEventListener("click", () => {
      const count = Number(button.dataset.seedCount);
      for (const item of document.querySelectorAll("[data-seed-count]")) {
        item.classList.toggle("is-active", item === button);
      }
      seedConversation(count);
    });
  }

  for (const button of document.querySelectorAll("[data-cursor-mode]")) {
    button.addEventListener("click", () => {
      applyArtifactMode(button.dataset.cursorMode ?? "off");
      triggerArtifactBurst(0.75);
    });
  }

  refs.streamButton.addEventListener("click", () => startStreaming());
  refs.jumpButton.addEventListener("click", () => {
    scrollToBottom("smooth");
    state.anchor = true;
    updateStats();
  });
  refs.sendButton.addEventListener("click", handleSend);
  refs.composerInput.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      handleSend();
    }
  });

  window.addEventListener("resize", () => {
    refreshLayoutCache({ includeHero: true });
    state.surfaceDirty = true;
    refreshAfterFullMeasure();
  });
  window.addEventListener(
    "scroll",
    () => {
      refreshLayoutCache({ includeHero: true });
      state.surfaceDirty = true;
    },
    { passive: true },
  );
}

async function boot() {
  setupHeroTitle();
  resetHeroWords();
  refreshLayoutCache({ includeHero: true });
  bindPointerEvents();
  bindAppEvents();
  applyArtifactMode("orb");
  startMotionLoop();
  updateAmbientStage();
  setFrameWidth(state.frameWidth);
  seedConversation(1000);

  try {
    const pretext = await import("https://esm.sh/@chenglou/pretext@0.0.3");
    state.pretext = pretext;
    refs.engineState.textContent = "ready";
    refs.statusBadge.textContent = "ready";
    refreshAfterFullMeasure();
  } catch (error) {
    refs.engineState.textContent = "failed";
    refs.statusBadge.textContent = "fallback";
    console.error("Pretext import failed", error);
    refreshAfterFullMeasure();
  }
}

boot();
