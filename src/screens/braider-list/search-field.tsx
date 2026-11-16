import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/text';
import { useTheme } from '@/hooks/use-theme';
import { fontFamily, radius, spacing, typography } from '@/theme';

type SearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchField({ value, onChangeText }: SearchFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceMuted, borderColor: focused ? colors.primary : 'transparent' },
      ]}
    >
      <Text color="textTertiary" style={styles.icon} accessible={false}>
        ⌕
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by name or style"
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.primary}
        accessibilityLabel="Search braiders by name or specialty"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
        enterKeyHint="search"
        inputMode="search"
        returnKeyType="search"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, { color: colors.text }]}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={spacing.md}
          onPress={() => onChangeText('')}
          style={[styles.clear, { backgroundColor: colors.textTertiary }]}
        >
          <Text variant="caption" style={{ color: colors.surface }}>
            ✕
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 46,
    gap: spacing.sm,
    borderWidth: 1.5,
  },
  icon: { fontSize: 20, lineHeight: 22 },
  input: {
    ...typography.body,
    fontFamily,
    flex: 1,
    paddingVertical: spacing.sm,
    // The container border is the focus indicator; suppress the browser's inner outline.
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  clear: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
