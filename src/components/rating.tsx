import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/text';
import { spacing } from '@/theme';
import { formatRating } from '@/utils/format';

export function Rating({ value }: { value: number }) {
  const label = formatRating(value);
  return (
    <View style={styles.row} accessible accessibilityLabel={`Rated ${label} out of 5`}>
      <Text variant="footnote" color="rating">
        ★
      </Text>
      <Text variant="footnote" style={styles.value}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  value: { fontWeight: '600' },
});
