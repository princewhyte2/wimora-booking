import { router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { getErrorMessage } from '@/api/client';
import { useCreateBooking } from '@/api/queries';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ChoiceChip } from '@/components/choice-chip';
import { Section } from '@/components/section';
import { Text } from '@/components/text';
import { TextField } from '@/components/text-field';
import { useTheme } from '@/hooks/use-theme';
import { BookingSummary } from '@/screens/booking/booking-summary';
import { ServiceOption } from '@/screens/booking/service-option';
import { MAX_CONTENT_WIDTH, radius, spacing } from '@/theme';
import type { Braider } from '@/types/domain';
import { hasErrors, validateBookingForm, type BookingFormField, type BookingFormValues } from '@/utils/booking-form';
import { formatDuration, formatPrice } from '@/utils/format';

type BookingFormProps = {
  braider: Braider;
  initialServiceName?: string;
  initialSlot?: string;
};

export function BookingForm({ braider, initialServiceName, initialSlot }: BookingFormProps) {
  const { colors } = useTheme();
  const createBooking = useCreateBooking();
  const phoneInputRef = useRef<ComponentRef<typeof TextInput>>(null);

  const [values, setValues] = useState<BookingFormValues>(() => ({
    serviceName: braider.services.find((service) => service.name === initialServiceName)?.name ?? null,
    slot: initialSlot && braider.slots.includes(initialSlot) ? initialSlot : null,
    customerName: '',
    customerPhone: '',
  }));
  const [touched, setTouched] = useState<Partial<Record<BookingFormField, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Availability can change underneath the form (e.g. after a slot conflict
  // refetch), so a selection only counts while it is still offered.
  const selectedService = braider.services.find((service) => service.name === values.serviceName);
  const selectedSlot = values.slot && braider.slots.includes(values.slot) ? values.slot : null;
  const effectiveValues: BookingFormValues = {
    ...values,
    serviceName: selectedService?.name ?? null,
    slot: selectedSlot,
  };

  const errors = validateBookingForm(effectiveValues);
  const visibleError = (field: BookingFormField) => (submitAttempted || touched[field] ? errors[field] : undefined);

  function updateField<K extends BookingFormField>(field: K, value: BookingFormValues[K]) {
    setValues((previous) => ({ ...previous, [field]: value }));
    // Any edit makes a previous submission error stale.
    if (createBooking.isError) createBooking.reset();
  }

  const markTouched = (field: BookingFormField) => setTouched((previous) => ({ ...previous, [field]: true }));

  function handleSubmit() {
    setSubmitAttempted(true);
    if (hasErrors(errors) || !selectedService || !selectedSlot) return;

    createBooking.mutate(
      {
        braiderId: braider.id,
        serviceName: selectedService.name,
        slot: selectedSlot,
        customerName: effectiveValues.customerName,
        customerPhone: effectiveValues.customerPhone,
      },
      {
        // Replace so "back" from the confirmation can't resubmit the form.
        onSuccess: (booking) =>
          router.replace({ pathname: '/bookings/[bookingId]', params: { bookingId: booking.id } }),
      },
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
    >
      <Text variant="subhead" color="textSecondary">
        Booking with{' '}
        <Text variant="subhead" style={styles.emphasis}>
          {braider.name}
        </Text>{' '}
        in {braider.location}
      </Text>

      <Section title="1. Choose a service" error={visibleError('serviceName')}>
        <View accessibilityRole="radiogroup" style={styles.stack}>
          {braider.services.map((service) => (
            <ServiceOption
              key={service.name}
              service={service}
              selected={service.name === selectedService?.name}
              onPress={() => updateField('serviceName', service.name)}
            />
          ))}
        </View>
      </Section>

      <Section title="2. Pick a time" error={visibleError('slot')}>
        {braider.slots.length > 0 ? (
          <View accessibilityRole="radiogroup" style={styles.chips}>
            {braider.slots.map((slot) => (
              <ChoiceChip
                key={slot}
                label={slot}
                selected={slot === selectedSlot}
                onPress={() => updateField('slot', slot)}
              />
            ))}
          </View>
        ) : (
          <Text variant="subhead" color="textSecondary">
            {braider.name} is fully booked this week.
          </Text>
        )}
      </Section>

      <Section title="3. Your details" caption="We’ll text your confirmation to this number.">
        <View style={styles.stack}>
          <TextField
            label="Full name"
            placeholder="e.g. Ngozi Adeyemi"
            value={values.customerName}
            onChangeText={(text) => updateField('customerName', text)}
            onBlur={() => markTouched('customerName')}
            error={visibleError('customerName')}
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => phoneInputRef.current?.focus()}
          />
          <TextField
            ref={phoneInputRef}
            label="Phone number"
            placeholder="(713) 555-0142"
            value={values.customerPhone}
            onChangeText={(text) => updateField('customerPhone', text)}
            onBlur={() => markTouched('customerPhone')}
            error={visibleError('customerPhone')}
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            inputMode="tel"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
        </View>
      </Section>

      <Card style={styles.summary}>
        <BookingSummary
          lines={[
            { label: 'Service', value: selectedService ? selectedService.name : '—' },
            { label: 'Duration', value: selectedService ? formatDuration(selectedService.minutes) : '—' },
            { label: 'Time', value: selectedSlot ?? '—' },
          ]}
          total={{ label: 'Total', value: selectedService ? formatPrice(selectedService.price) : '—' }}
        />
      </Card>

      {createBooking.isError ? (
        <View
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
          style={[styles.banner, { backgroundColor: colors.dangerSoft }]}
        >
          <Text variant="subhead" color="danger">
            {getErrorMessage(createBooking.error)}
          </Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Button label="Confirm booking" loading={createBooking.isPending} onPress={handleSubmit} />
        <Text variant="footnote" color="textTertiary" style={styles.center}>
          You won’t be charged until your appointment.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  emphasis: { fontWeight: '600' },
  stack: { gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  summary: { padding: spacing.lg },
  banner: { padding: spacing.md, borderRadius: radius.md },
  actions: { gap: spacing.sm },
  center: { textAlign: 'center' },
});
