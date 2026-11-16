import { useLocalSearchParams } from 'expo-router';

import { BookingScreen } from '@/screens/booking';
import { firstParam } from '@/utils/route-params';

type BookRouteParams = {
  id: string;
  /** Optional pre-selection when arriving from a tapped service or slot. */
  service?: string | string[];
  slot?: string | string[];
};

export default function BookRoute() {
  const { id, service, slot } = useLocalSearchParams<BookRouteParams>();
  return <BookingScreen braiderId={id} initialServiceName={firstParam(service)} initialSlot={firstParam(slot)} />;
}
