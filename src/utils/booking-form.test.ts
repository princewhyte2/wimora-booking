import { hasErrors, validateBookingForm, type BookingFormValues } from '@/utils/booking-form';

const valid: BookingFormValues = {
  serviceName: 'Cornrows',
  slot: 'Mon 9:00 AM',
  customerName: 'Ngozi Ade',
  customerPhone: '(713) 555-0142',
};

describe('validateBookingForm', () => {
  it('accepts a complete form', () => {
    expect(hasErrors(validateBookingForm(valid))).toBe(false);
  });

  it('requires a service and a slot', () => {
    const errors = validateBookingForm({ ...valid, serviceName: null, slot: null });
    expect(errors.serviceName).toBeDefined();
    expect(errors.slot).toBeDefined();
  });

  it('rejects blank or too-short names', () => {
    expect(validateBookingForm({ ...valid, customerName: '   ' }).customerName).toBe('Enter your name.');
    expect(validateBookingForm({ ...valid, customerName: 'A' }).customerName).toMatch(/at least/);
  });

  it.each(['+1 713 555 0142', '713-555-0142', '+447911123456'])('accepts phone "%s"', (phone) => {
    expect(validateBookingForm({ ...valid, customerPhone: phone }).customerPhone).toBeUndefined();
  });

  it.each(['', '555-0142', 'call me', '+1 713 555 0142 1234 5'])('rejects phone "%s"', (phone) => {
    expect(validateBookingForm({ ...valid, customerPhone: phone }).customerPhone).toBeDefined();
  });
});
