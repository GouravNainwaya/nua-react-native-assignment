export interface RetryOptions {
  maxRetries: number;
  baseDelayMs: number;
}

export const getExponentialBackoffDelay = (
  attempt: number, // 1 for first retry, 2 for second, etc.
  baseDelayMs: number,
) => baseDelayMs * 2 ** Math.max(attempt - 1, 0);

/**
 * Wraps an async operation with exponential backoff retries.
 * like for example attempt=1 => 500ms, attempt=2 => 1000ms, attempt=3 => 2000ms.
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions = { maxRetries: 3, baseDelayMs: 500 }
): Promise<T> => {
  let retryCount = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      retryCount++;
      if (retryCount > options.maxRetries) {
        throw error;
      }
      
      const delayMs = getExponentialBackoffDelay(retryCount, options.baseDelayMs);
      console.log(`[Retry] Attempt ${retryCount} failed. Waiting ${delayMs}ms before next retry...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};
