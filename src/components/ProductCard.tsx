import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatPrice } from '@/utils/format';
import type { Product } from '@/data/types';
import { useLanguage } from '@/context/LanguageContext';

export interface ProductCardProps {
  product: Product;
  /** Called when the card body is pressed (opens product details). */
  onPress?: (product: Product) => void;
  /** Called when the "add to cart" action is triggered. */
  onAddToCart?: (product: Product) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Composed product card used across Home, Product List and search results.
 */
export function ProductCard({ product, onPress, onAddToCart, style }: ProductCardProps) {
  const router = useRouter();
  const { language, t } = useLanguage();

  const handlePress = () => {
    if (onPress) {
      onPress(product);
    } else {
      router.push({ pathname: '/product/[id]', params: { id: product.id } });
    }
  };

  return (
    <Card onPress={handlePress} style={style}>
      <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" transition={200} />
      <ThemedView style={styles.content}>
        <ThemedText type="smallBold" numberOfLines={2}>
          {t(product.name)}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {language === 'ar'
            ? `${product.rating.toFixed(1)} من 5 · ${product.reviewsCount} تقييم`
            : `${product.rating.toFixed(1)} / 5 · ${product.reviewsCount} reviews`}
        </ThemedText>
        <ThemedView style={styles.footer}>
          <ThemedText type="smallBold" style={styles.price as StyleProp<TextStyle>}>
            {formatPrice(product.price)}
          </ThemedText>
          {product.oldPrice ? (
            <ThemedText type="small" themeColor="textSecondary" style={styles.oldPrice}>
              {formatPrice(product.oldPrice)}
            </ThemedText>
          ) : null}
        </ThemedView>
      </ThemedView>
      {onAddToCart ? (
        <Button
          variant="outline"
          size="small"
          fullWidth
          onPress={() => onAddToCart(product)}
          style={styles.addButton}>
          <Icon name={{ ios: 'cart', android: 'shopping_cart', web: 'shopping_cart' }} size={14} color="#208AEF" />
          <ThemedText type="smallBold" style={{ marginInlineStart: 6 }}>
            {t('أضف إلى السلة')}
          </ThemedText>
        </Button>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    backgroundColor: '#F2F5F9',
  },
  content: {
    paddingTop: 10,
    gap: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  price: {
    color: '#0B5FFF',
    fontWeight: '700',
  },
  oldPrice: {
    textDecorationLine: 'line-through',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: 'transparent',
  },
});
