import { router } from 'expo-router';

import { getErrorMessage, isApiError } from '@/api/client';
import { StateView } from '@/components/state-view';

type QueryErrorViewProps = {
  error: unknown;
  title: string;
  notFoundTitle?: string;
  onRetry: () => void;
};

/**
 * Error state for a failed query. Retrying can't fix a missing resource, so
 * not-found errors offer a way back to the list instead of "Try again".
 */
export function QueryErrorView({ error, title, notFoundTitle = 'Not found', onRetry }: QueryErrorViewProps) {
  const isNotFound = isApiError(error) && error.code === 'NOT_FOUND';

  return (
    <StateView
      title={isNotFound ? notFoundTitle : title}
      message={getErrorMessage(error)}
      action={
        isNotFound
          ? { label: 'Browse braiders', onPress: () => router.dismissTo('/') }
          : { label: 'Try again', onPress: onRetry }
      }
    />
  );
}
