import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/text';
import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';
import type { Service } from '@/types/domain';
import { formatDuration, formatPrice } from '@/utils/format';

type ServiceOptionProps = {
  service: Service;
  selected: boolean;
  onPress: () => void;
};

export function ServiceOption({ service, selected, onPress }: ServiceOptionProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${service.name}, ${formatDuration(service.minutes)}, ${formatPrice(service.price)}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? colors.primarySoft : pressed ? colors.surfaceMuted : colors.surface,
        },
      ]}
    >
      <View style={[styles.radio, { borderColor: selected ? colors.primary : colors.textTertiary }]}>
        {selected ? <View style={[styles.radioDot, { backgroundColor: colors.primary }]} /> : null}
      </View>
      <View style={styles.details}>
        <Text variant="callout">{service.name}</Text>
        <Text variant="footnote" color="textSecondary">
          {formatDuration(service.minutes)}
        </Text>
      </View>
      <Text variant="headline">{formatPrice(service.price)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  details: { flex: 1, gap: spacing.xxs },
});
