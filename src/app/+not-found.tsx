import { router, Stack } from 'expo-router';

import { StateView } from '@/components/state-view';

export default function NotFoundRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <StateView
        title="This page doesn’t exist"
        message="The link may be broken or the page may have moved."
        action={{ label: 'Browse braiders', onPress: () => router.replace('/') }}
      />
    </>
  );
}
