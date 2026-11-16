import { useLocalSearchParams } from 'expo-router';

import { BookingConfirmationScreen } from '@/screens/booking-confirmation';

export default function BookingConfirmationRoute() {
  const { bookingId } = useLocalSearchParams<'/bookings/[bookingId]'>();
  return <BookingConfirmationScreen bookingId={bookingId} />;
}
