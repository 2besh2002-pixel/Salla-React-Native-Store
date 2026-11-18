import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { Spacing } from '@/constants/theme';

export interface ListItemProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  /** Content rendered on the leading side (price / quantity / actions). */
  right?: ReactNode;
  onPress?: () => void;
}

/**
 * Primitive reusable list row used by categories, cart lines and search results.
 */
export function ListItem({ icon, title, subtitle, right, onPress }: ListItemProps) {
  const content = (
    <>
      {icon ? <ThemedView style={styles.iconContainer}>{icon}</ThemedView> : null}
      <ThemedView style={styles.content}>
        <ThemedText type="smallBold">{title}</ThemedText>
        {subtitle ? <ThemedText type="small" themeColor="textSecondary">{subtitle}</ThemedText> : null}
      </ThemedView>
      {right ? <ThemedView style={styles.right}>{right}</ThemedView> : null}
    </>
  );

  const style = StyleSheet.flatten([styles.row, onPress ? styles.pressable : null]) as StyleProp<ViewStyle>;

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={style}>
        {content}
      </Pressable>
    );
  }

  return <ThemedView style={style}>{content}</ThemedView>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
  pressable: {
    backgroundColor: '#F3F6FB',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8F1FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
});
