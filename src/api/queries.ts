import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createBooking, fetchBooking } from '@/api/bookings';
import { fetchBraider, fetchBraiders } from '@/api/braiders';
import type { Booking, BookingRequest, Braider } from '@/types/domain';

/** Centralised query keys so invalidation can never drift from the queries. */
export const queryKeys = {
  braiders: ['braiders'] as const,
  braider: (id: string) => ['braiders', id] as const,
  booking: (id: string) => ['bookings', id] as const,
};

export function useBraiders() {
  return useQuery({
    queryKey: queryKeys.braiders,
    queryFn: ({ signal }) => fetchBraiders(signal),
  });
}

export function useBraider(id: string) {
  const queryClient = useQueryClient();

  return useQuery<Braider>({
    queryKey: queryKeys.braider(id),
    queryFn: ({ signal }) => fetchBraider(id, signal),
    // Coming from the list we already hold this braider, so render it
    // immediately while the detail request refreshes it in the background.
    placeholderData: () =>
      queryClient.getQueryData<Braider[]>(queryKeys.braiders)?.find((braider) => braider.id === id),
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.booking(id),
    queryFn: ({ signal }) => fetchBooking(id, signal),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BookingRequest) => createBooking(request),
    onSuccess: (booking: Booking) => {
      // Prime the confirmation screen so it renders instantly.
      queryClient.setQueryData(queryKeys.booking(booking.id), booking);
    },
    // Success or a slot conflict both mean availability changed. The prefix
    // key refreshes the list and every braider detail.
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.braiders }),
  });
}
