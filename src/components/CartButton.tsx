import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { ROUTES } from '../navigation/routes';
import { selectCartCount } from '../store/cartSelectors';
import type { RootStackParamList } from '../types/navigation';

export function CartButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cartCount = useSelector(selectCartCount);

  return (
    <Pressable
      style={({ pressed }) => [styles.cartButton, pressed && styles.pressed]}
      onPress={() => navigation.navigate(ROUTES.CART)}
      accessibilityRole="button"
      accessibilityLabel="View Cart"
    >
      <Text style={styles.cartIcon}>🛒</Text>
      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartButton: {
    position: 'relative',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.7,
  },
  cartIcon: {
    fontSize: 22,
    lineHeight: 26,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -4,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
});
