import { Redirect, useLocalSearchParams } from 'expo-router';

export default function ProductListRoute() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  return <Redirect href={{ pathname: '/(tabs)', params: { categoryId } }} />;
}
