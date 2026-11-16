import { Link, type Href } from 'expo-router';
import { Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

type LinkPressableProps = Omit<PressableProps, 'style' | 'children'> & {
  href: Href;
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

/**
 * A `Link` (real `<a href>` on web — middle-click, open in new tab, crawlable)
 * that renders a styled, press-aware surface.
 *
 * `Link asChild` merges props through a Slot that drops Pressable's
 * function-style on web, so styling lives on an inner View instead.
 */
export function LinkPressable({ href, style, pressedStyle, children, ...rest }: LinkPressableProps) {
  return (
    <Link href={href} asChild>
      <Pressable {...rest}>
        {({ pressed }) => <View style={[style, pressed && pressedStyle]}>{children}</View>}
      </Pressable>
    </Link>
  );
}
