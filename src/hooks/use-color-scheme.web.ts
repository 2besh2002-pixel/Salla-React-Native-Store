import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 * Falls back to light until the native color scheme is available.
 */
export function useColorScheme() {
  const colorScheme = useRNColorScheme();
  return colorScheme ?? 'light';
}
