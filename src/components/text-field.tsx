import { useState, type ComponentRef, type Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Text } from '@/components/text';
import { useTheme } from '@/hooks/use-theme';
import { fontFamily, radius, spacing, typography } from '@/theme';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  ref?: Ref<ComponentRef<typeof TextInput>>;
  label: string;
  error?: string;
};

export function TextField({ ref, label, error, onFocus, onBlur, ...rest }: TextFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={styles.container}>
      <Text variant="footnote" color="textSecondary" style={styles.label}>
        {label}
      </Text>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        accessibilityHint={error}
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.primary}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor }]}
        {...rest}
      />
      {error ? (
        <Text variant="footnote" color="danger" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  label: { fontWeight: '600' },
  input: {
    ...typography.body,
    fontFamily,
    minHeight: 50,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    // Focus is shown via borderColor; suppress the duplicate browser outline.
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
});
