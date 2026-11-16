import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { LinkPressable } from '@/components/link-pressable';
import { Rating } from '@/components/rating';
import { Text } from '@/components/text';
import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';
import type { Braider } from '@/types/domain';
import { formatPrice, formatRating } from '@/utils/format';

export function BraiderRow({ braider }: { braider: Braider }) {
  const { colors } = useTheme();
  const price = formatPrice(braider.priceFrom);

  return (
    <LinkPressable
      href={{ pathname: '/braiders/[id]', params: { id: braider.id } }}
      accessibilityLabel={`${braider.name}, ${braider.specialty}, rated ${formatRating(braider.rating)}, from ${price}`}
      accessibilityHint="Opens services and available times"
      style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
      pressedStyle={{ backgroundColor: colors.surfaceMuted }}
    >
      <Avatar name={braider.name} />

      <View style={styles.details}>
        <Text variant="headline" numberOfLines={1}>
          {braider.name}
        </Text>
        <Text variant="subhead" color="textSecondary" numberOfLines={1}>
          {braider.specialty}
        </Text>
        <View style={styles.meta}>
          <Rating value={braider.rating} />
          <Text variant="footnote" color="textTertiary">
            · {braider.location}
          </Text>
        </View>
      </View>

      <View style={styles.price}>
        <Text variant="caption" color="textTertiary">
          FROM
        </Text>
        <Text variant="headline" color="primary">
          {price}
        </Text>
      </View>
    </LinkPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  details: { flex: 1, gap: spacing.xxs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xxs },
  price: { alignItems: 'flex-end' },
});
