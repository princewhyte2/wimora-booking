import { useColorScheme } from 'react-native';

import { colors, type ColorScheme, type ThemeColors } from '@/theme';

export function useTheme(): { scheme: ColorScheme; colors: ThemeColors } {
  const scheme: ColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { scheme, colors: colors[scheme] };
}
