import { ApiError, simulateRequest } from '@/api/client';
import { db } from '@/api/mock-db';
import type { Booking, BookingRequest } from '@/types/domain';

const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateReference(): string {
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)];
  }
  return `WM-${code}`;
}

/**
 * Validates the request against the current catalogue and reserves the slot.
 * The client validates too, but the server stays the source of truth — e.g. a
 * slot can be taken between loading the form and submitting it.
 */
export function createBooking(request: BookingRequest): Promise<Booking> {
  return simulateRequest(() => {
    const braider = db.braiders.find((candidate) => candidate.id === request.braiderId);
    if (!braider) {
      throw new ApiError('NOT_FOUND', 'This braider is no longer taking bookings.');
    }

    const service = braider.services.find((candidate) => candidate.name === request.serviceName);
    if (!service) {
      throw new ApiError('VALIDATION', 'The selected service is no longer offered.');
    }

    if (!braider.slots.includes(request.slot) || db.isSlotReserved(braider.id, request.slot)) {
      throw new ApiError('CONFLICT', `${request.slot} was just booked by someone else. Please choose another time.`);
    }

    const reference = generateReference();
    const booking: Booking = {
      id: reference,
      reference,
      createdAt: new Date().toISOString(),
      braider: { id: braider.id, name: braider.name, location: braider.location },
      service,
      slot: request.slot,
      customer: { name: request.customerName.trim(), phone: request.customerPhone.trim() },
    };

    db.saveBooking(booking);
    return booking;
  });
}

export function fetchBooking(id: string, signal?: AbortSignal): Promise<Booking> {
  return simulateRequest(() => {
    const booking = db.findBooking(id);
    if (!booking) {
      throw new ApiError('NOT_FOUND', 'We couldn’t find this booking. It may have expired from this session.');
    }
    return booking;
  }, signal);
}
