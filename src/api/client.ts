export type ApiErrorCode = 'NETWORK' | 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION';

export class ApiError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

/** Returns a message that is safe to show to the user for any thrown value. */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  return 'Something went wrong. Please try again.';
}

const LATENCY_MS = 600;

function readFailureRate(): number {
  const rate = Number(process.env.EXPO_PUBLIC_MOCK_FAILURE_RATE ?? 0);
  return Number.isFinite(rate) ? Math.min(Math.max(rate, 0), 1) : 0;
}

const FAILURE_RATE = readFailureRate();

/**
 * Simulates a network round trip around an in-memory resolver so screens
 * exercise real loading, error and cancellation paths. Set
 * `EXPO_PUBLIC_MOCK_FAILURE_RATE` (0–1) to inject random network failures.
 */
export function simulateRequest<T>(resolve: () => T, signal?: AbortSignal): Promise<T> {
  return new Promise<T>((onSuccess, onError) => {
    if (signal?.aborted) {
      onError(signal.reason);
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);

      if (Math.random() < FAILURE_RATE) {
        onError(new ApiError('NETWORK', 'We couldn’t reach Wimora. Check your connection and try again.'));
        return;
      }

      try {
        onSuccess(resolve());
      } catch (error) {
        onError(error);
      }
    }, LATENCY_MS);

    function onAbort() {
      clearTimeout(timer);
      onError(signal?.reason);
    }

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}
