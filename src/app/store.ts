import { configureStore } from '@reduxjs/toolkit';

import { productsApi } from '../api/productsApi';
import cartReducer from '../store/cartSlice';
import themeReducer from '../store/themeSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    theme: themeReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
