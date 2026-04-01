export type MessageRole = "user" | "assistant" | "system";
export type MessageStatus = "complete" | "streaming" | "error";
export type WhiteSpaceMode = "normal" | "pre-wrap";

export interface FlowMessage {
  id: string;
  role: MessageRole;
  content: string;
  status: MessageStatus;
  timestamp?: number;
  metadata?: Record<string, unknown>;
}

export interface PretextAdapter {
  prepare(text: string, font: string, options?: { whiteSpace?: WhiteSpaceMode }): unknown;
  layout(
    prepared: unknown,
    maxWidth: number,
    lineHeight: number,
  ): { height: number; lineCount: number };
}

export interface HeightEngineOptions {
  font: string;
  lineHeight: number;
  whiteSpace?: WhiteSpaceMode;
  bubbleWidthRatio?: number;
  minBubbleWidth?: number;
  maxBubbleWidth?: number;
  horizontalPadding?: number;
  verticalPadding?: number;
  messageGap?: number;
  streamingExtra?: number;
}

export interface HeightMeasurement {
  lineCount: number;
  contentHeight: number;
  outerHeight: number;
  textWidth: number;
}

export interface HeightEngine<TMessage extends FlowMessage = FlowMessage> {
  measure(message: TMessage, containerWidth: number): HeightMeasurement;
  measureMany(
    messages: readonly TMessage[],
    containerWidth: number,
  ): Map<string, HeightMeasurement>;
  measurePartial(
    messageId: string,
    partialText: string,
    containerWidth: number,
  ): HeightMeasurement;
  invalidate(messageId?: string): void;
}

export interface ViewportRange {
  start: number;
  end: number;
}
