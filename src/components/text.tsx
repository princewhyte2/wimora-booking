import { StyleSheet, Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { fontFamily, typography, type ThemeColors, type TypographyVariant } from '@/theme';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: keyof ThemeColors;
};

export function Text({ variant = 'body', color = 'text', style, ...rest }: TextProps) {
  const { colors } = useTheme();
  return <RNText style={[styles.base, typography[variant], { color: colors[color] }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  base: { fontFamily },
});
