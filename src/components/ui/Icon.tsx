import { SymbolView } from 'expo-symbols';
import type { StyleProp, TextStyle, ViewProps } from 'react-native';

import type { AndroidSymbol, SFSymbol } from 'expo-symbols';

export type IconNameValue = SFSymbol | { ios?: SFSymbol; android?: AndroidSymbol; web?: AndroidSymbol };

export interface IconProps extends Omit<ViewProps, 'style'> {
  /** SF Symbol name (iOS) / Material symbol name (Android & web). */
  name: IconNameValue;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * Primitive UI icon built on top of `expo-symbols`.
 * Used across the app for tab bars, buttons, list items, headers, etc.
 */
export function Icon({ name, size = 24, color, style, ...rest }: IconProps) {
  return <SymbolView name={name} size={size} tintColor={color} style={style} {...rest} />;
}
