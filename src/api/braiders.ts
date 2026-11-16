import { ApiError, simulateRequest } from '@/api/client';
import { db } from '@/api/mock-db';
import type { Braider } from '@/types/domain';

/** Returns the braider with already-booked slots removed, as a real API would. */
function withAvailableSlots(braider: Braider): Braider {
  return {
    ...braider,
    slots: braider.slots.filter((slot) => !db.isSlotReserved(braider.id, slot)),
  };
}

export function fetchBraiders(signal?: AbortSignal): Promise<Braider[]> {
  return simulateRequest(() => db.braiders.map(withAvailableSlots), signal);
}

export function fetchBraider(id: string, signal?: AbortSignal): Promise<Braider> {
  return simulateRequest(() => {
    const braider = db.braiders.find((candidate) => candidate.id === id);
    if (!braider) {
      throw new ApiError('NOT_FOUND', 'We couldn’t find that braider. They may no longer be taking bookings.');
    }
    return withAvailableSlots(braider);
  }, signal);
}
