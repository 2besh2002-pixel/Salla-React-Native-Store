import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedView } from '@/components/themed-view';

export interface CardProps extends PressableProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Primitive reusable card container. Behaves as a touchable when `onPress` is provided.
 */
export function Card({ onPress, style, children, ...rest }: CardProps) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed, style]} {...rest}>
        {children}
      </Pressable>
    );
  }

  return (
    <ThemedView style={[styles.card, style]} {...rest}>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.85,
  },
});
