import { StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { MAX_CONTENT_WIDTH, spacing } from '@/theme';

/** Sticky bottom bar for a screen's primary action, padded for the home indicator. */
export function ScreenFooter({ children, style, ...rest }: ViewProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, spacing.lg),
        },
      ]}
      {...rest}
    >
      <View style={[styles.inner, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  inner: { width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center', gap: spacing.sm },
});
