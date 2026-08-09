import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';

interface CartState {
  itemsById: Record<number, CartItem>;
  hasHydrated: boolean;
}

const initialState: CartState = {
  itemsById: {},
  hasHydrated: false,
};

const toCartItem = (product: Product): CartItem => ({
  productId: product.id,
  title: product.title,
  price: product.price,
  discountPercentage: product.discountPercentage,
  thumbnail: product.thumbnail,
  quantity: 1,
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.itemsById[product.id];

      if (existingItem) {
        existingItem.quantity += 1;
        return;
      }

      state.itemsById[product.id] = toCartItem(product);
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.itemsById[action.payload];

      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.itemsById[action.payload];

      if (!item) {
        return;
      }

      if (item.quantity <= 1) {
        delete state.itemsById[action.payload];
        return;
      }

      item.quantity -= 1;
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      delete state.itemsById[action.payload];
    },
    clearCart: state => {
      state.itemsById = {};
    },
    hydrateCart: (state, action: PayloadAction<Record<number, CartItem>>) => {
      state.itemsById = action.payload;
      state.hasHydrated = true;
    },
    markCartHydrated: state => {
      state.hasHydrated = true;
    },
  },
});

export const {
  addToCart,
  clearCart,
  decrementQuantity,
  hydrateCart,
  incrementQuantity,
  markCartHydrated,
  removeFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
