import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { Text } from '@/components/text';
import { useTheme } from '@/hooks/use-theme';
import { radius, spacing } from '@/theme';

type ButtonVariant = 'primary' | 'secondary';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
};

export function Button({ label, variant = 'primary', loading = false, disabled, ...rest }: ButtonProps) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';
  const isInactive = disabled || loading;
  const foreground = isPrimary ? colors.onPrimary : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isInactive, busy: loading }}
      disabled={isInactive}
      style={({ pressed }) => [
        styles.base,
        isPrimary
          ? { backgroundColor: pressed ? colors.primaryPressed : colors.primary }
          : {
              backgroundColor: pressed ? colors.primarySoft : 'transparent',
              borderColor: colors.border,
              borderWidth: 1,
            },
        isInactive && styles.inactive,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={foreground} />
      ) : (
        <Text variant="headline" style={{ color: foreground }}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactive: { opacity: 0.5 },
});
