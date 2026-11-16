import { useLocalSearchParams } from 'expo-router';

import { BraiderDetailScreen } from '@/screens/braider-detail';

export default function BraiderDetailRoute() {
  const { id } = useLocalSearchParams<'/braiders/[id]'>();
  return <BraiderDetailScreen braiderId={id} />;
}
