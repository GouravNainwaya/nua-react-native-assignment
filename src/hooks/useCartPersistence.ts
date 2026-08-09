import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { storage } from '../services/storage';
import { selectCartItemsById, selectHasHydratedCart } from '../store/cartSelectors';
import { hydrateCart, markCartHydrated } from '../store/cartSlice';

const CART_STORAGE_KEY = '@cart_items';

export function useCartPersistence() {
  const dispatch = useDispatch();
  const itemsById = useSelector(selectCartItemsById);
  const hasHydrated = useSelector(selectHasHydratedCart);
  
  const isFirstRenderAfterHydration = useRef(true);

  // 1. Hydration
  useEffect(() => {
    async function loadCart() {
      try {
        const storedValue = await storage.getString(CART_STORAGE_KEY);
        if (storedValue) {
          const parsed = JSON.parse(storedValue);
          
          if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
            dispatch(hydrateCart(parsed));
            return;
          }
        }
      } catch (error) {
        console.error('Failed to parse cart from AsyncStorage, resetting cart.', error);
      }
      
      // Fallback: empty cart
      dispatch(markCartHydrated());
    }

    loadCart();
  }, [dispatch]);

  // 2. Persistence
  useEffect(() => {
    if (!hasHydrated) {
      return; // Do not persist before hydration is complete
    }

    if (isFirstRenderAfterHydration.current) {
      isFirstRenderAfterHydration.current = false;
      return; // Do not persist the immediately hydrated cart back to storage
    }

    storage.setString(CART_STORAGE_KEY, JSON.stringify(itemsById)).catch(error => {
      console.error('Failed to save cart to AsyncStorage', error);
    });
  }, [itemsById, hasHydrated]);

  return { hasHydrated };
}
