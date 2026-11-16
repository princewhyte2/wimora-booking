export type BookingFormValues = {
  serviceName: string | null;
  slot: string | null;
  customerName: string;
  customerPhone: string;
};

export type BookingFormField = keyof BookingFormValues;
export type BookingFormErrors = Partial<Record<BookingFormField, string>>;

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 60;
const PHONE_MIN_DIGITS = 10;
const PHONE_MAX_DIGITS = 15; // E.164 maximum
const PHONE_ALLOWED_CHARACTERS = /^\+?[\d\s().-]+$/;

export const countDigits = (value: string): number => value.replace(/\D/g, '').length;

export function validateBookingForm(values: BookingFormValues): BookingFormErrors {
  const errors: BookingFormErrors = {};

  if (!values.serviceName) errors.serviceName = 'Choose a service.';
  if (!values.slot) errors.slot = 'Choose a time slot.';

  const name = values.customerName.trim();
  if (!name) {
    errors.customerName = 'Enter your name.';
  } else if (name.length < NAME_MIN_LENGTH) {
    errors.customerName = `Name must be at least ${NAME_MIN_LENGTH} characters.`;
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.customerName = `Name must be ${NAME_MAX_LENGTH} characters or fewer.`;
  }

  const phone = values.customerPhone.trim();
  const digits = countDigits(phone);
  if (!phone) {
    errors.customerPhone = 'Enter your phone number.';
  } else if (!PHONE_ALLOWED_CHARACTERS.test(phone) || digits < PHONE_MIN_DIGITS || digits > PHONE_MAX_DIGITS) {
    errors.customerPhone = 'Enter a valid phone number, e.g. (713) 555-0142.';
  }

  return errors;
}

export const hasErrors = (errors: BookingFormErrors): boolean => Object.keys(errors).length > 0;
