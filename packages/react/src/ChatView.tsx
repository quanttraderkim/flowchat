import {
  ViewportManager,
  type FlowMessage,
  type HeightMeasurement,
  type HeightEngine,
} from "@flowchat/core";
import {
  startTransition,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { ChatViewProps } from "./types";

type LayoutState = {
  range: { start: number; end: number };
  offsets: readonly number[];
  measurements: HeightMeasurement[];
  totalHeight: number;
  anchored: boolean;
};

function createInitialState(): LayoutState {
  return {
    range: { start: 0, end: 0 },
    offsets: [0],
    measurements: [],
    totalHeight: 0,
    anchored: true,
  };
}

export function ChatView<TMessage extends FlowMessage = FlowMessage>({
  messages,
  heightEngine,
  overscanPx = 420,
  className,
  style,
  onAnchorChange,
  renderMessage,
}: ChatViewProps<TMessage>) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const managerRef = useRef(new ViewportManager(overscanPx));
  const [layoutState, setLayoutState] = useState<LayoutState>(createInitialState);

  const syncLayout = useEffectEvent(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const nextMeasurements = messages.map((message) =>
      heightEngine.measure(message, viewport.clientWidth),
    );
    managerRef.current.setHeights(
      nextMeasurements.map((measurement) => measurement.outerHeight),
    );

    const nextAnchored = managerRef.current.isAnchored(
      viewport.scrollTop,
      viewport.clientHeight,
    );
    const nextRange = managerRef.current.getVisibleRange(
      viewport.scrollTop,
      viewport.clientHeight,
    );

    startTransition(() => {
      setLayoutState({
        range: nextRange,
        offsets: managerRef.current.getOffsets(),
        measurements: nextMeasurements,
        totalHeight: managerRef.current.getTotalHeight(),
        anchored: nextAnchored,
      });
    });

    onAnchorChange?.(nextAnchored);
  });

  const syncVisibleRange = useEffectEvent(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const nextAnchored = managerRef.current.isAnchored(
      viewport.scrollTop,
      viewport.clientHeight,
    );
    const nextRange = managerRef.current.getVisibleRange(
      viewport.scrollTop,
      viewport.clientHeight,
    );

    startTransition(() => {
      setLayoutState((current) => ({
        ...current,
        range: nextRange,
        anchored: nextAnchored,
      }));
    });

    onAnchorChange?.(nextAnchored);
  });

  useEffect(() => {
    managerRef.current = new ViewportManager(overscanPx);
    syncLayout();
  }, [overscanPx]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const observer = new ResizeObserver(() => {
      syncLayout();
    });

    observer.observe(viewport);
    syncLayout();

    return () => observer.disconnect();
  }, [messages]);

  useEffect(() => {
    syncLayout();
  }, [messages, heightEngine]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const handleScroll = () => syncVisibleRange();
    viewport.addEventListener("scroll", handleScroll, { passive: true });

    return () => viewport.removeEventListener("scroll", handleScroll);
  }, []);

  const children = [];
  for (let index = layoutState.range.start; index < layoutState.range.end; index += 1) {
    const message = messages[index];
    const measurement = layoutState.measurements[index];
    const top = layoutState.offsets[index] ?? 0;

    children.push(
      <div
        key={message.id}
        style={{
          position: "absolute",
          insetInline: 0,
          top: 0,
          transform: `translateY(${top}px)`,
        }}
      >
        {renderMessage?.({
          index,
          message,
          measurement,
          top,
        }) ?? (
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              fontFamily: "inherit",
            }}
          >
            {message.content}
          </pre>
        )}
      </div>,
    );
  }

  return (
    <div className={className} style={style}>
      <div
        ref={viewportRef}
        style={{
          position: "relative",
          overflow: "auto",
          height: "100%",
        }}
      >
        <div style={{ position: "relative", height: layoutState.totalHeight }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export type { HeightEngine };
