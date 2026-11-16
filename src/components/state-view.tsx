import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { useTheme } from '@/hooks/use-theme';
import { spacing } from '@/theme';

type StateViewProps = {
  title: string;
  message?: string;
  action?: { label: string; onPress: () => void };
};

/** Centered message used for empty, error and not-found states. */
export function StateView({ title, message, action }: StateViewProps) {
  return (
    <View style={styles.container} accessibilityRole="summary">
      <Text variant="headline" style={styles.center}>
        {title}
      </Text>
      {message ? (
        <Text variant="subhead" color="textSecondary" style={styles.center}>
          {message}
        </Text>
      ) : null}
      {action ? (
        <View style={styles.action}>
          <Button variant="secondary" label={action.label} onPress={action.onPress} />
        </View>
      ) : null}
    </View>
  );
}

export function LoadingView({ label = 'Loading' }: { label?: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.container} accessibilityLabel={label} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
  },
  center: { textAlign: 'center', maxWidth: 360 },
  action: { marginTop: spacing.md },
});
