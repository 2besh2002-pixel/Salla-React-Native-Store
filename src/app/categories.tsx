/**
 * @file src/app/categories.tsx
 * Categories Route - Redirects to Categories Tab.
 */

import { Redirect } from 'expo-router';

export default function CategoriesRoute() {
  return <Redirect href="/(tabs)/categories" />;
}
