import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { storage } from '../services/storage';
import { selectHasHydratedTheme, selectThemeMode } from '../store/themeSelectors';
import { hydrateTheme, markThemeHydrated } from '../store/themeSlice';

const THEME_STORAGE_KEY = '@theme_mode';

export function useThemePersistence() {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const hasHydrated = useSelector(selectHasHydratedTheme);
  
  const isFirstRenderAfterHydration = useRef(true);

  // 1. Hydration
  useEffect(() => {
    async function loadTheme() {
      try {
        const storedValue = await storage.getString(THEME_STORAGE_KEY);
        if (storedValue === 'light' || storedValue === 'dark') {
          dispatch(hydrateTheme(storedValue));
          return;
        }
      } catch (error) {
        console.error('Failed to parse theme from AsyncStorage, defaulting to light mode.', error);
      }
      
      // Fallback: default to light
      dispatch(markThemeHydrated());
    }

    loadTheme();
  }, [dispatch]);

  // 2. Persistence
  useEffect(() => {
    if (!hasHydrated) {
      return; // Do not persist before hydration is complete
    }

    if (isFirstRenderAfterHydration.current) {
      isFirstRenderAfterHydration.current = false;
      return; // Do not persist the immediately hydrated theme back to storage
    }

    storage.setString(THEME_STORAGE_KEY, themeMode).catch(error => {
      console.error('Failed to save theme to AsyncStorage', error);
    });
  }, [themeMode, hasHydrated]);

  return { hasHydrated, themeMode };
}
