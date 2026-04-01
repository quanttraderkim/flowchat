import type {
  FlowMessage,
  HeightEngine,
  HeightEngineOptions,
  HeightMeasurement,
  MessageStatus,
  PretextAdapter,
} from "./types";

type CacheEntry = {
  content: string;
  prepared: unknown;
  measurements: Map<string, HeightMeasurement>;
};

const defaultOptions: Required<HeightEngineOptions> = {
  font: '500 15px "Pretendard Variable", Pretendard, "SUIT Variable", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
  lineHeight: 24,
  whiteSpace: "pre-wrap",
  bubbleWidthRatio: 0.76,
  minBubbleWidth: 240,
  maxBubbleWidth: 720,
  horizontalPadding: 32,
  verticalPadding: 56,
  messageGap: 14,
  streamingExtra: 6,
};

export class PretextHeightEngine<TMessage extends FlowMessage = FlowMessage>
  implements HeightEngine<TMessage>
{
  private readonly options: Required<HeightEngineOptions>;
  private readonly cache = new Map<string, CacheEntry>();

  constructor(
    private readonly adapter: PretextAdapter,
    options: HeightEngineOptions,
  ) {
    this.options = { ...defaultOptions, ...options };
  }

  measure(message: TMessage, containerWidth: number): HeightMeasurement {
    return this.measureText(
      message.id,
      message.content,
      message.status,
      containerWidth,
    );
  }

  measureMany(
    messages: readonly TMessage[],
    containerWidth: number,
  ): Map<string, HeightMeasurement> {
    const measurements = new Map<string, HeightMeasurement>();

    for (const message of messages) {
      measurements.set(message.id, this.measure(message, containerWidth));
    }

    return measurements;
  }

  measurePartial(
    messageId: string,
    partialText: string,
    containerWidth: number,
  ): HeightMeasurement {
    return this.measureText(
      messageId,
      partialText,
      "streaming",
      containerWidth,
    );
  }

  invalidate(messageId?: string): void {
    if (messageId === undefined) {
      this.cache.clear();
      return;
    }

    this.cache.delete(messageId);
  }

  private measureText(
    messageId: string,
    content: string,
    status: MessageStatus,
    containerWidth: number,
  ): HeightMeasurement {
    const textWidth = this.resolveTextWidth(containerWidth);
    const cacheKey = `${textWidth}:${status}`;
    const entry = this.getCacheEntry(messageId, content);
    const cached = entry.measurements.get(cacheKey);

    if (cached !== undefined) {
      return cached;
    }

    const layout = this.adapter.layout(
      entry.prepared,
      textWidth,
      this.options.lineHeight,
    );
    const measurement: HeightMeasurement = {
      lineCount: layout.lineCount,
      contentHeight: layout.height,
      outerHeight: Math.ceil(
        layout.height +
          this.options.verticalPadding +
          this.options.messageGap +
          (status === "streaming" ? this.options.streamingExtra : 0),
      ),
      textWidth,
    };

    entry.measurements.set(cacheKey, measurement);
    return measurement;
  }

  private getCacheEntry(messageId: string, content: string): CacheEntry {
    const cached = this.cache.get(messageId);
    if (cached && cached.content === content) {
      return cached;
    }

    const prepared = this.adapter.prepare(content, this.options.font, {
      whiteSpace: this.options.whiteSpace,
    });
    const nextEntry: CacheEntry = {
      content,
      prepared,
      measurements: new Map(),
    };

    this.cache.set(messageId, nextEntry);
    return nextEntry;
  }

  private resolveTextWidth(containerWidth: number): number {
    const bubbleWidth = Math.min(
      Math.max(containerWidth * this.options.bubbleWidthRatio, this.options.minBubbleWidth),
      this.options.maxBubbleWidth,
    );

    return Math.max(120, bubbleWidth - this.options.horizontalPadding);
  }
}

export function createHeightEngine<TMessage extends FlowMessage = FlowMessage>(
  adapter: PretextAdapter,
  options: HeightEngineOptions,
): HeightEngine<TMessage> {
  return new PretextHeightEngine<TMessage>(adapter, options);
}
