import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  hasHydrated: boolean;
}

const initialState: ThemeState = {
  mode: 'light',
  hasHydrated: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    hydrateTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.hasHydrated = true;
    },
    markThemeHydrated: (state) => {
      state.hasHydrated = true;
    },
  },
});

export const { setThemeMode, hydrateTheme, markThemeHydrated } = themeSlice.actions;

export default themeSlice.reducer;
