import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useBooking } from '@/api/queries';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ScreenFooter } from '@/components/screen-footer';
import { QueryErrorView } from '@/components/query-error-view';
import { LoadingView } from '@/components/state-view';
import { Text } from '@/components/text';
import { useTheme } from '@/hooks/use-theme';
import { BookingSummary } from '@/screens/booking/booking-summary';
import { MAX_CONTENT_WIDTH, spacing } from '@/theme';
import { formatDuration, formatPrice } from '@/utils/format';

const backToBraiders = () => router.dismissTo('/');

export function BookingConfirmationScreen({ bookingId }: { bookingId: string }) {
  const { colors } = useTheme();
  const booking = useBooking(bookingId);

  // Data first: a failed background refetch keeps showing what we already have.
  if (booking.data === undefined) {
    return booking.isError ? (
      <QueryErrorView
        error={booking.error}
        title="Couldn’t load your booking"
        notFoundTitle="Booking not found"
        onRetry={() => booking.refetch()}
      />
    ) : (
      <LoadingView label="Loading your booking" />
    );
  }

  const { braider, service, slot, customer, reference } = booking.data;

  return (
    <View style={styles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <View style={styles.hero} accessible accessibilityLabel={`Booking confirmed. Reference ${reference}`}>
          <View style={[styles.badge, { backgroundColor: colors.successSoft }]}>
            <Text style={[styles.check, { color: colors.success }]}>✓</Text>
          </View>
          <Text variant="largeTitle" style={styles.center}>
            You’re booked!
          </Text>
          <Text variant="subhead" color="textSecondary" style={styles.center}>
            Your appointment with {braider.name} is set for {slot}. We’ve texted the details to {customer.phone}.
          </Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.referenceRow}>
            <Text variant="caption" color="textTertiary">
              BOOKING REFERENCE
            </Text>
            <Text variant="headline" selectable>
              {reference}
            </Text>
          </View>
          <BookingSummary
            lines={[
              { label: 'Braider', value: braider.name },
              { label: 'Location', value: braider.location },
              { label: 'Service', value: service.name },
              { label: 'Duration', value: formatDuration(service.minutes) },
              { label: 'Time', value: slot },
              { label: 'Name', value: customer.name },
              { label: 'Phone', value: customer.phone },
            ]}
            total={{ label: 'Total due at appointment', value: formatPrice(service.price) }}
          />
        </Card>
      </ScrollView>

      <ScreenFooter>
        <Button label="Back to braiders" onPress={backToBraiders} />
      </ScreenFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    padding: spacing.lg,
    gap: spacing.xl,
  },
  hero: { alignItems: 'center', gap: spacing.sm, paddingTop: spacing.lg },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  check: { fontSize: 36, lineHeight: 40, fontWeight: '700' },
  center: { textAlign: 'center' },
  card: { gap: spacing.lg },
  referenceRow: { gap: spacing.xxs },
});
