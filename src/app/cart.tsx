/**
 * @file src/app/cart.tsx
 * Cart Route - Redirects to Cart Tab or renders CartScreen.
 */

import { Redirect } from 'expo-router';

export default function CartRoute() {
  return <Redirect href="/(tabs)/cart" />;
}
