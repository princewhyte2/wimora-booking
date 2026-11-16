import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/text';
import { useTheme } from '@/hooks/use-theme';
import { getInitials } from '@/utils/format';

type AvatarProps = {
  name: string;
  size?: number;
};

/** Initials avatar — the mock data has no photos, so this keeps rows scannable. */
export function Avatar({ name, size = 48 }: AvatarProps) {
  const { colors } = useTheme();
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primarySoft },
      ]}
    >
      <Text variant="headline" style={{ color: colors.primary, fontSize: size * 0.36 }}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
});
