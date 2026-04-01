import type { CSSProperties, ReactNode } from "react";
import type { FlowMessage, HeightEngine, HeightMeasurement } from "@flowchat/core";

export interface ChatViewRenderContext<TMessage extends FlowMessage = FlowMessage> {
  index: number;
  message: TMessage;
  measurement: HeightMeasurement;
  top: number;
}

export interface ChatViewProps<TMessage extends FlowMessage = FlowMessage> {
  messages: readonly TMessage[];
  heightEngine: HeightEngine<TMessage>;
  overscanPx?: number;
  className?: string;
  style?: CSSProperties;
  onAnchorChange?: (anchored: boolean) => void;
  renderMessage?: (context: ChatViewRenderContext<TMessage>) => ReactNode;
}
