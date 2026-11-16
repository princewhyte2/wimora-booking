import { BRAIDERS } from '@/data/braiders';
import type { Booking } from '@/types/domain';

/**
 * In-memory stand-in for a backend. State lives for the lifetime of the JS
 * runtime only, which is enough to demonstrate slot reservation end to end.
 */
const bookings = new Map<string, Booking>();
const reservedSlots = new Set<string>();

const slotKey = (braiderId: string, slot: string) => `${braiderId}::${slot}`;

export const db = {
  braiders: BRAIDERS,

  isSlotReserved: (braiderId: string, slot: string) => reservedSlots.has(slotKey(braiderId, slot)),

  saveBooking(booking: Booking) {
    bookings.set(booking.id, booking);
    reservedSlots.add(slotKey(booking.braider.id, booking.slot));
  },

  findBooking: (id: string) => bookings.get(id),
};
