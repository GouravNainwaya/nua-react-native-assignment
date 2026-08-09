type AnalyticsMetadata = Record<string, string | number | boolean | null | undefined>;

export const analytics = {
  track(eventName: string, metadata: AnalyticsMetadata = {}) {
    console.log('[Analytics]', eventName, {
      ...metadata,
      timestamp: metadata.timestamp ?? Date.now(),
    });
  },
};
