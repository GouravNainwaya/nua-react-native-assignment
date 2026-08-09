import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useGetProductByIdQuery } from '../api/productsApi';
import { ErrorState } from '../components/ErrorState';
import { useThemeColors } from '../hooks/useThemeColors';
import { ROUTES } from '../navigation/routes';
import { analytics } from '../services/analytics';
import { addToCart } from '../store/cartSlice';
import type { RootStackParamList } from '../types/navigation';
import { calculateDiscountedPrice } from '../utils/price';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const dispatch = useDispatch();
  const { colors } = useThemeColors();

  const { data: product, isLoading, error, refetch } = useGetProductByIdQuery(productId);
  const [addingToCart, setAddingToCart] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  useFocusEffect(
    useCallback(() => {
      if (product) {
        analytics.track('product_viewed', {
          productId: product.id,
          title: product.title,
        });
      }
    }, [product]),
  );

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ErrorState
          title="Product not found"
          message="We couldn't load the details for this product."
          onAction={refetch}
        />
      </View>
    );
  }

  const discountedPrice = calculateDiscountedPrice(product.price, product.discountPercentage);

  const handleAddToCart = () => {
    setAddingToCart(true);
    dispatch(addToCart(product));
    analytics.track('add_to_cart', {
      productId: product.id,
      quantity: 1,
    });
    setTimeout(() => setAddingToCart(false), 500); // Visual feedback
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.imageContainer, { backgroundColor: colors.backgroundSecondary }]}>
        {product.images && product.images.length > 1 ? (
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={[styles.carouselImage, { width: screenWidth }]}
                resizeMode="contain"
              />
            )}
          />
        ) : product.thumbnail ? (
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text style={[styles.noImageText, { color: colors.textMuted }]}>No Image Available</Text>
        )}
      </View>

      <View style={styles.detailsContainer}>
        {product.brand && <Text style={[styles.brand, { color: colors.primary }]}>{product.brand}</Text>}
        <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>

        <View style={styles.priceContainer}>
          <Text style={[styles.discountedPrice, { color: colors.primary }]}>${discountedPrice.toFixed(2)}</Text>
          {product.discountPercentage > 0 && (
            <Text style={[styles.originalPrice, { color: colors.textMuted }]}>${product.price.toFixed(2)}</Text>
          )}
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]}>{product.description}</Text>

        <View style={[styles.metaContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>⭐ {product.rating} / 5</Text>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>📦 {product.stock} in stock</Text>
        </View>

        <TouchableOpacity
          style={[styles.policyButton, { borderColor: colors.border }]}
          onPress={() => navigation.navigate(ROUTES.RETURN_POLICY, {
            url: 'https://reactnative.dev/docs/getting-started',
            title: 'Return Policy'
          })}
        >
          <Text style={[styles.policyButtonText, { color: colors.primary }]}>View Return Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: colors.primary }, addingToCart && styles.addingToCart]}
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          <Text style={styles.addToCartText}>
            {addingToCart ? 'Added!' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  carouselImage: {
    height: '100%',
  },
  noImageText: {
    fontSize: 16,
  },
  detailsContainer: {
    padding: 16,
  },
  brand: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  discountedPrice: {
    fontSize: 24,
    fontWeight: '800',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  policyButton: {
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  policyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addToCartButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  addingToCart: {
    opacity: 0.7,
  },
});
