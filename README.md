# Nua React Native Assignment

This is a comprehensive React Native e-commerce application built as an assignment. It features product listing, debounced searching, infinite scrolling, cart management with persistence, and full dark-mode compatibility. 

## Features
- **Product Listing:** Infinite scroll and pull-to-refresh connected to the DummyJSON API.
- **Search:** 400ms debounced search with built-in protection against race-conditions.
- **Product Details:** Image carousel, discounted price calculation, and stock information.
- **Cart & State Management:** Powered by Redux Toolkit for UI state and RTK Query for server state.
- **Cart Persistence:** Saves to AsyncStorage with a custom hydration strategy to prevent empty-cart overwrites on launch.
- **Return Policy:** In-app WebView integration.
- **Mock Analytics:** Tracks key events (`product_viewed`, `add_to_cart`, `search_performed`, `app_backgrounded`).
- **Resilient UI:** Graceful error handling, loading states, and a custom **Exponential Backoff Retry** mechanism for network failures.
- **Testing:** Includes Jest unit tests specifically targeting UI state race-conditions.

---

## Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- npm, yarn, or bun
- iOS Simulator or Android Emulator (or Expo Go app on a physical device)

### Installation
1. Clone the repository and navigate into the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm run start
   ```
4. Press `i` to open in iOS simulator, or `a` to open in Android emulator.

### Running Tests
To run the Jest unit tests (verifies the race-condition handler):
```bash
npm run test
```

To run TypeScript type-checking:
```bash
npm run typecheck
```

---

## Assumptions & Trade-offs

1. **State Management Separation:** I chose to use **RTK Query** for server state (fetching/caching products) and traditional **Redux Slices** for local UI state (Cart, Theme). This prevents server-side data from unnecessarily bloating the local Redux store and gives us out-of-the-box caching.
2. **Race Condition Handling (Search vs. Refresh):** Instead of relying solely on `AbortController`, I implemented a deterministic `sessionId` reference pattern in `useProductListController`. This ensures that if the user rapidly searches and pulls-to-refresh, the UI loading spinners (e.g., `isRefreshing` vs `isInitialLoading`) properly cancel each other out and the list strictly renders the latest requested dataset.
3. **Cart Hydration Protection:** A common flaw in AsyncStorage cart implementation is the initial empty cart overwriting the persistent cart during the first render. I implemented a strict `isFirstRenderAfterHydration` lock to ensure data flows only from Storage -> Redux on launch, and Redux -> Storage thereafter.
4. **Theme Persistence:** Assumed that the user's theme preference should be remembered. If the user selects Dark Mode, it saves to AsyncStorage and applies instantly on the next app launch.
5. **WebView Integration:** Assumed that keeping the Return Policy inside the app via `react-native-webview` provides a more cohesive user experience than linking out to a system browser.

---

## What I'd Improve With More Time

1. **End-to-End Testing (E2E):** While Jest handles unit testing for our hooks, I would add **Detox** or **Maestro** to simulate full user flows (scrolling, adding to cart, navigating) on an actual emulator.
2. **Offline-First Architecture:** Instead of just showing error states when offline, I would integrate an offline database (like **WatermelonDB** or **Realm**) to cache the last viewed products, allowing the user to browse their recent history without a network connection.
3. **Micro-Animations & Transitions:** I would use `react-native-reanimated` to add Shared Element Transitions (e.g., animating the product image expanding from the List Screen into the Detail Screen) for a more premium, native feel.
4. **Advanced Accessibility:** Conduct a full audit using VoiceOver (iOS) and TalkBack (Android) to ensure proper ARIA labels, focus states, and contrast ratios for visually impaired users.
