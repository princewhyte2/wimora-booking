import { useBraider } from '@/api/queries';
import { QueryErrorView } from '@/components/query-error-view';
import { LoadingView } from '@/components/state-view';
import { BookingForm } from '@/screens/booking/booking-form';

type BookingScreenProps = {
  braiderId: string;
  initialServiceName?: string;
  initialSlot?: string;
};

/**
 * Owns data loading; the form only mounts once the braider is available so its
 * initial state (pre-selected service/slot) can be derived synchronously.
 */
export function BookingScreen({ braiderId, initialServiceName, initialSlot }: BookingScreenProps) {
  const braider = useBraider(braiderId);

  // Data first: a failed background refetch keeps showing what we already have.
  if (braider.data === undefined) {
    return braider.isError ? (
      <QueryErrorView
        error={braider.error}
        title="Couldn’t start your booking"
        notFoundTitle="Braider not found"
        onRetry={() => braider.refetch()}
      />
    ) : (
      <LoadingView label="Loading booking options" />
    );
  }

  return <BookingForm braider={braider.data} initialServiceName={initialServiceName} initialSlot={initialSlot} />;
}
