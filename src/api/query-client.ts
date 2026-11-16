import { QueryClient } from '@tanstack/react-query';

import { isApiError } from '@/api/client';

const MAX_RETRIES = 2;

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        // Only transient failures are worth retrying; a 404 won't fix itself.
        retry: (failureCount, error) => failureCount < MAX_RETRIES && (!isApiError(error) || error.code === 'NETWORK'),
      },
      mutations: { retry: false },
    },
  });
}
