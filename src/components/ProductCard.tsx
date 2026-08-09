import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useThemeColors } from '../hooks/useThemeColors';
import type { RootStackParamList } from '../types/navigation';
import type { Product } from '../types/product';
import { calculateDiscountedPrice } from '../utils/price';

interface ProductCardProps {
  product: Product;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(value);

function ProductCardComponent({ product }: ProductCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useThemeColors();

  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage,
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View details for ${product.title}`}
      onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.imageContainer, { backgroundColor: colors.background }]}>
        {product.thumbnail ? (
          <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.noImage, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.noImageText, { color: colors.textMuted }]}>No image</Text>
          </View>
        )}
      </View>

      <View style={styles.contentContainer}>
        {product.brand && <Text style={[styles.brand, { color: colors.primary }]}>{product.brand}</Text>}
        
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {product.title}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={[styles.discountedPrice, { color: colors.primary }]}>{formatCurrency(discountedPrice)}</Text>
          {product.discountPercentage > 0 && (
            <Text style={[styles.originalPrice, { color: colors.textMuted }]}>{formatCurrency(product.price)}</Text>
          )}
        </View>

        <View style={styles.metaContainer}>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>⭐ {product.rating}</Text>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>📦 {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export const ProductCard = memo(ProductCardComponent);

const styles = StyleSheet.create({
  card: {
    borderColor: '#e5e5e5',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 6,
    minHeight: 120,
    overflow: 'hidden',
    padding: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontSize: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 12,
  },
  brand: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
