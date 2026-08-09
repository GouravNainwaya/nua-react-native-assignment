import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { EmptyState } from '../components/EmptyState';
import { useThemeColors } from '../hooks/useThemeColors';
import {
  selectCartCount,
  selectCartItems,
  selectCartTotal,
} from '../store/cartSelectors';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../store/cartSlice';
import type { CartItem } from '../types/cart';
import type { RootStackParamList } from '../types/navigation';
import { calculateDiscountedPrice } from '../utils/price';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(value);

export function CartScreen() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalCount = useSelector(selectCartCount);
  const totalPrice = useSelector(selectCartTotal);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useThemeColors();

  if (items.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <EmptyState
          title="Your cart is empty"
          message="Looks like you haven't added any products to your cart yet."
        />
        <Pressable
          style={({ pressed }) => [styles.continueButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}
          onPress={() => navigation.navigate('ProductList')}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </Pressable>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CartItem }) => {
    const discountedPrice = calculateDiscountedPrice(item.price, item.discountPercentage);

    return (
      <View style={[styles.cartItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <View style={[styles.imageContainer, { backgroundColor: colors.background }]}>
          {item.thumbnail && (
            <Image source={{ uri: item.thumbnail }} style={styles.image} resizeMode="contain" />
          )}
        </View>

        <View style={styles.itemDetails}>
          <Text numberOfLines={2} style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.itemPrice, { color: colors.primary }]}>{formatCurrency(discountedPrice)}</Text>
          
          <View style={styles.quantityControls}>
            <Pressable
              style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }, pressed && styles.pressed]}
              onPress={() => dispatch(decrementQuantity(item.productId))}
            >
              <Text style={[styles.iconButtonText, { color: colors.text }]}>−</Text>
            </Pressable>
            <Text style={[styles.quantity, { color: colors.text }]}>{item.quantity}</Text>
            <Pressable
              style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }, pressed && styles.pressed]}
              onPress={() => dispatch(incrementQuantity(item.productId))}
            >
              <Text style={[styles.iconButtonText, { color: colors.text }]}>+</Text>
            </Pressable>
            
            <View style={{ flex: 1 }} />
            
            <Pressable
              style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}
              onPress={() => dispatch(removeFromCart(item.productId))}
            >
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <FlatList
        data={items}
        keyExtractor={item => String(item.productId)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
      <View style={[styles.footer, { backgroundColor: colors.cardBackground, borderTopColor: colors.border }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Items:</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{totalCount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabelTotal, { color: colors.text }]}>Total:</Text>
          <Text style={[styles.summaryValueTotal, { color: colors.primary }]}>{formatCurrency(totalPrice)}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.checkoutButton, { backgroundColor: colors.primary }, pressed && styles.pressedCheckout]}
          onPress={() => {}}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 24,
  },
  continueButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f766e',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d4d4d8',
  },
  iconButtonText: {
    fontSize: 18,
    lineHeight: 20,
    color: '#3f3f46',
    fontWeight: '600',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#171717',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.6,
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#525252',
  },
  summaryValue: {
    fontSize: 15,
    color: '#171717',
    fontWeight: '600',
  },
  summaryLabelTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
  },
  summaryValueTotal: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f766e',
  },
  checkoutButton: {
    backgroundColor: '#0f766e',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  pressedCheckout: {
    opacity: 0.8,
  },
  checkoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
