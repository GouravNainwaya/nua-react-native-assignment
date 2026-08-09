import type { RootState } from '../app/store';
import { calculateDiscountedPrice } from '../utils/price';

export const selectCartItemsById = (state: RootState) => state.cart.itemsById;

export const selectCartItems = (state: RootState) =>
  Object.values(state.cart.itemsById);

export const selectCartCount = (state: RootState) =>
  selectCartItems(state).reduce((total, item) => total + item.quantity, 0);

export const selectCartTotal = (state: RootState) =>
  selectCartItems(state).reduce(
    (total, item) =>
      total +
      calculateDiscountedPrice(item.price, item.discountPercentage) *
        item.quantity,
    0,
  );

export const selectHasHydratedCart = (state: RootState) =>
  state.cart.hasHydrated;

export const selectCartItemById = (state: RootState, productId: number) =>
  state.cart.itemsById[productId];
