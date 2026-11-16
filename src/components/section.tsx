import { StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from '@/components/text';
import { spacing } from '@/theme';

type SectionProps = ViewProps & {
  title: string;
  caption?: string;
  error?: string;
};

export function Section({ title, caption, error, children, style, ...rest }: SectionProps) {
  return (
    <View style={[styles.section, style]} {...rest}>
      <View style={styles.header}>
        <Text variant="headline" accessibilityRole="header">
          {title}
        </Text>
        {caption ? (
          <Text variant="footnote" color="textSecondary">
            {caption}
          </Text>
        ) : null}
      </View>
      {children}
      {error ? (
        <Text variant="footnote" color="danger" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  header: { gap: spacing.xxs },
});
