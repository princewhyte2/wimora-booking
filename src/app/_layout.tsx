import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from 'expo-router/react-navigation';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { createQueryClient } from '@/api/query-client';
import { useTheme } from '@/hooks/use-theme';
import { fontFamily } from '@/theme';

// Deep links (e.g. a shared /braiders/2 URL) still get the list underneath,
// so there is always a back button.
export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  // Created once per app instance (not at module scope) so tests and fast
  // refresh never share cache state.
  const [queryClient] = useState(createQueryClient);
  const { scheme, colors } = useTheme();

  const baseTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme: Theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerTintColor: colors.primary,
            headerTitleStyle: { color: colors.text, fontFamily },
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Find a braider', headerLargeTitleEnabled: true }} />
          <Stack.Screen name="braiders/[id]/index" options={{ title: '' }} />
          <Stack.Screen name="braiders/[id]/book" options={{ title: 'Book appointment' }} />
          <Stack.Screen
            name="bookings/[bookingId]"
            options={{
              title: 'Confirmed',
              // Terminal step: leave only via "Back to braiders" so the form can't be resubmitted.
              headerBackVisible: false,
              headerLeft: () => null,
              gestureEnabled: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
