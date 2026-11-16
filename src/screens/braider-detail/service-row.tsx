import { StyleSheet, View } from 'react-native';

import { LinkPressable } from '@/components/link-pressable';
import { Text } from '@/components/text';
import { useTheme } from '@/hooks/use-theme';
import { spacing } from '@/theme';
import type { Service } from '@/types/domain';
import { formatDuration, formatPrice } from '@/utils/format';

type ServiceRowProps = {
  braiderId: string;
  service: Service;
  isLast: boolean;
};

export function ServiceRow({ braiderId, service, isLast }: ServiceRowProps) {
  const { colors } = useTheme();
  const duration = formatDuration(service.minutes);
  const price = formatPrice(service.price);

  return (
    <LinkPressable
      href={{ pathname: '/braiders/[id]/book', params: { id: braiderId, service: service.name } }}
      accessibilityLabel={`${service.name}, ${duration}, ${price}`}
      accessibilityHint="Book this service"
      style={[styles.row, !isLast && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}
      pressedStyle={styles.pressed}
    >
      <View style={styles.details}>
        <Text variant="callout">{service.name}</Text>
        <Text variant="footnote" color="textSecondary">
          {duration}
        </Text>
      </View>
      <Text variant="headline">{price}</Text>
      <Text variant="headline" color="textTertiary" accessible={false}>
        ›
      </Text>
    </LinkPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  details: { flex: 1, gap: spacing.xxs },
  pressed: { opacity: 0.6 },
});
