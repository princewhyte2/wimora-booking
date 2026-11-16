import { router, Stack } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useBraider } from '@/api/queries';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { LinkPressable } from '@/components/link-pressable';
import { ScreenFooter } from '@/components/screen-footer';
import { Section } from '@/components/section';
import { QueryErrorView } from '@/components/query-error-view';
import { LoadingView } from '@/components/state-view';
import { Text } from '@/components/text';
import { useTheme } from '@/hooks/use-theme';
import { BraiderProfile } from '@/screens/braider-detail/braider-profile';
import { ServiceRow } from '@/screens/braider-detail/service-row';
import { MAX_CONTENT_WIDTH, radius, spacing } from '@/theme';

export function BraiderDetailScreen({ braiderId }: { braiderId: string }) {
  const { colors } = useTheme();
  const braider = useBraider(braiderId);

  const { data } = braider;

  // Data first: a failed background refetch keeps showing what we already have.
  if (data === undefined) {
    return braider.isError ? (
      <QueryErrorView
        error={braider.error}
        title="Couldn’t load this braider"
        notFoundTitle="Braider not found"
        onRetry={() => braider.refetch()}
      />
    ) : (
      <LoadingView label="Loading braider" />
    );
  }

  const hasSlots = data.slots.length > 0;

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: data.name }} />

      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <BraiderProfile braider={data} />

        <Section title="Services" caption="Tap a service to book it.">
          <Card style={styles.services}>
            {data.services.map((service, index) => (
              <ServiceRow
                key={service.name}
                braiderId={data.id}
                service={service}
                isLast={index === data.services.length - 1}
              />
            ))}
          </Card>
        </Section>

        <Section title="Available times" caption={hasSlots ? 'Pick a time to start booking.' : undefined}>
          {hasSlots ? (
            <View style={styles.slots}>
              {data.slots.map((slot) => (
                <LinkPressable
                  key={slot}
                  href={{ pathname: '/braiders/[id]/book', params: { id: data.id, slot } }}
                  accessibilityHint="Book at this time"
                  style={[styles.slot, { borderColor: colors.border, backgroundColor: colors.surface }]}
                  pressedStyle={{ backgroundColor: colors.primarySoft }}
                >
                  <Text variant="callout">{slot}</Text>
                </LinkPressable>
              ))}
            </View>
          ) : (
            <Text variant="subhead" color="textSecondary">
              Fully booked this week. Check back soon for new openings.
            </Text>
          )}
        </Section>
      </ScrollView>

      <ScreenFooter>
        <Button
          label={hasSlots ? 'Book appointment' : 'No times available'}
          disabled={!hasSlots}
          onPress={() => router.push({ pathname: '/braiders/[id]/book', params: { id: data.id } })}
        />
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
  services: { paddingVertical: spacing.xs },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
