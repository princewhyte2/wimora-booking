import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/text';
import { useTheme } from '@/hooks/use-theme';
import { spacing } from '@/theme';

export type SummaryLine = { label: string; value: string };

type BookingSummaryProps = {
  lines: SummaryLine[];
  total?: SummaryLine;
};

/** Label/value receipt used by both the booking form and the confirmation. */
export function BookingSummary({ lines, total }: BookingSummaryProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {lines.map((line) => (
        <View key={line.label} style={styles.line}>
          <Text variant="subhead" color="textSecondary">
            {line.label}
          </Text>
          <Text variant="callout" style={styles.value}>
            {line.value}
          </Text>
        </View>
      ))}
      {total ? (
        <View style={[styles.line, styles.total, { borderTopColor: colors.border }]}>
          <Text variant="headline">{total.label}</Text>
          <Text variant="title" color="primary">
            {total.value}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  line: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.lg },
  value: { flexShrink: 1, textAlign: 'right' },
  total: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.md },
});
