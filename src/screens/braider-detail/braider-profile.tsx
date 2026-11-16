import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Card } from '@/components/card';
import { Rating } from '@/components/rating';
import { Text } from '@/components/text';
import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';
import type { Braider } from '@/types/domain';
import { formatPrice } from '@/utils/format';

export function BraiderProfile({ braider }: { braider: Braider }) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <Avatar name={braider.name} size={72} />
      <View style={styles.identity}>
        <Text variant="title" accessibilityRole="header" style={styles.center}>
          {braider.name}
        </Text>
        <Text variant="subhead" color="textSecondary">
          {braider.specialty} specialist · {braider.location}
        </Text>
      </View>
      <View style={[styles.stats, { borderTopColor: colors.border }]}>
        <Stat label="Rating">
          <Rating value={braider.rating} />
        </Stat>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Stat label="Starting at">
          <Text variant="footnote" style={styles.statValue}>
            {formatPrice(braider.priceFrom)}
          </Text>
        </Stat>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Stat label="Services">
          <Text variant="footnote" style={styles.statValue}>
            {braider.services.length}
          </Text>
        </Stat>
      </View>
    </Card>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.stat}>
      {children}
      <Text variant="caption" color="textTertiary">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', gap: spacing.md, paddingTop: spacing.xl, borderRadius: radius.xl },
  identity: { alignItems: 'center', gap: spacing.xs },
  center: { textAlign: 'center' },
  stats: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.md,
  },
  stat: { flex: 1, alignItems: 'center', gap: spacing.xxs },
  statValue: { fontWeight: '600' },
  divider: { width: StyleSheet.hairlineWidth },
});
