import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'small' | 'medium' | 'large';

const variantColors: Record<ButtonVariant, { background: string; foreground: string }> = {
  primary: { background: '#208AEF', foreground: '#FFFFFF' },
  secondary: { background: '#E8F1FE', foreground: '#1463C4' },
  outline: { background: 'transparent', foreground: '#208AEF' },
};

const sizeConfig: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
  small: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 12 },
  medium: { paddingVertical: 10, paddingHorizontal: 18, fontSize: 14 },
  large: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16 },
};

export interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Primitive reusable button.
 */
export function Button({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled,
  style,
  children,
  ...rest
}: ButtonProps) {
  const colors = variantColors[variant];
  const sizeStyle = sizeConfig[size];

  const resolvedStyle = [
    styles.base,
    { backgroundColor: colors.background, opacity: 1 },
    fullWidth ? { alignSelf: 'stretch' as const } : null,
    style as ViewStyle,
  ] as ViewStyle[];

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => {
        const resolved: StyleProp<ViewStyle> = [
          ...resolvedStyle,
          { backgroundColor: colors.background, opacity: pressed ? 0.8 : 1 },
        ];
        return resolved;
      }}
      {...rest}>
      <ThemedText
        style={[styles.text, { color: colors.foreground, fontSize: sizeStyle.fontSize }, fullWidth ? styles.textFullWidth : null]}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  text: {
    fontWeight: '600',
  },
  textFullWidth: {
    width: '100%',
  },
});
