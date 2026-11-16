import { createBooking, fetchBooking } from '@/api/bookings';
import { fetchBraider } from '@/api/braiders';
import { ApiError } from '@/api/client';
import type { BookingRequest } from '@/types/domain';

/**
 * Runs a mock request to completion without waiting on its simulated latency.
 * The outcome is captured before timers advance so rejections are never
 * reported as unhandled.
 */
async function settle<T>(promise: Promise<T>): Promise<T> {
  const outcome = promise.then(
    (value) => ({ ok: true as const, value }),
    (error: unknown) => ({ ok: false as const, error }),
  );
  await jest.runAllTimersAsync();
  const result = await outcome;
  if (!result.ok) throw result.error;
  return result.value;
}

const request = (overrides: Partial<BookingRequest> = {}): BookingRequest => ({
  braiderId: '1',
  serviceName: 'Cornrows',
  slot: 'Mon 9:00 AM',
  customerName: '  Ngozi Adeyemi ',
  customerPhone: '(713) 555-0142',
  ...overrides,
});

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('createBooking', () => {
  it('snapshots braider and service details and trims customer input', async () => {
    const booking = await settle(createBooking(request()));

    expect(booking.reference).toMatch(/^WM-[A-Z2-9]{6}$/);
    expect(booking.braider).toEqual({ id: '1', name: 'Adaeze Okafor', location: 'Houston' });
    expect(booking.service).toEqual({ name: 'Cornrows', price: 90, minutes: 120 });
    expect(booking.customer.name).toBe('Ngozi Adeyemi');
    await expect(settle(fetchBooking(booking.id))).resolves.toEqual(booking);
  });

  it('removes a booked slot from availability and rejects double booking', async () => {
    await settle(createBooking(request({ slot: 'Wed 10:00 AM' })));

    const braider = await settle(fetchBraider('1'));
    expect(braider.slots).not.toContain('Wed 10:00 AM');

    const second = settle(createBooking(request({ slot: 'Wed 10:00 AM' })));
    await expect(second).rejects.toBeInstanceOf(ApiError);
    await expect(second).rejects.toMatchObject({ code: 'CONFLICT' });
  });

  it('rejects a service the braider does not offer', async () => {
    await expect(settle(createBooking(request({ serviceName: 'Locs', slot: 'Mon 1:00 PM' })))).rejects.toMatchObject({
      code: 'VALIDATION',
    });
  });

  it('rejects an unknown braider', async () => {
    await expect(settle(createBooking(request({ braiderId: '404' })))).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});

describe('fetchBooking', () => {
  it('reports a missing booking as NOT_FOUND', async () => {
    await expect(settle(fetchBooking('WM-NOPE00'))).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});
