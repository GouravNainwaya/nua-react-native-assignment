// Mock RTK Query hooks at module level (hoisted by Jest before imports)
jest.mock('../src/api/productsApi', () => ({
  useLazyGetProductsQuery: jest.fn(),
  useLazySearchProductsQuery: jest.fn(),
}));

// Mock analytics — no side effects needed
jest.mock('../src/services/analytics', () => ({
  analytics: { track: jest.fn() },
}));

import { act, renderHook } from '@testing-library/react-native';

import * as productsApiModule from '../src/api/productsApi';
import { useProductListController } from '../src/hooks/useProductListController';

// Typed references to the mocked hooks
const mockFetchProducts = jest.fn();
const mockSearchProducts = jest.fn();

describe('useProductListController Race Condition', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockFetchProducts.mockReset();
    mockSearchProducts.mockReset();

    // Wire mocked hooks into RTK Query module
    (productsApiModule.useLazyGetProductsQuery as jest.Mock).mockReturnValue([mockFetchProducts]);
    (productsApiModule.useLazySearchProductsQuery as jest.Mock).mockReturnValue([mockSearchProducts]);

    // Initial page load (empty query) resolves immediately with no products
    mockFetchProducts.mockReturnValue({
      unwrap: () => Promise.resolve({ products: [], total: 0 }),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('ignores stale search responses when a newer search starts', async () => {
    let resolveIphone: any = () => console.log('resolveIphone not assigned yet');
    let resolveSamsung: any = () => console.log('resolveSamsung not assigned yet');

    // Each call to searchProducts returns a promise controlled by the test
    mockSearchProducts.mockImplementation((args: { query: string }) => {
      console.log('[Test] mockSearchProducts called with:', args.query);
      return {
        unwrap: () => {
          if (args.query === 'iphone') {
            return new Promise<{ products: any[]; total: number }>(res => {
              console.log('[Test] Promise created for iphone');
              resolveIphone = res;
            });
          } else {
            return new Promise<{ products: any[]; total: number }>(res => {
              console.log('[Test] Promise created for samsung');
              resolveSamsung = res;
            });
          }
        }
      };
    });

    const { result } = await renderHook(() => useProductListController());

    // Let initial load (empty query → fetchProducts) settle
    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    // ── Step 1: iphone request starts ────────────────────────────────────────
    console.log('[Test] Setting search to iphone');
    await act(async () => {
      result.current.setSearchText('iphone');
    });
    // Advance past the 400 ms debounce
    await act(async () => {
      jest.advanceTimersByTime(500);
      await Promise.resolve();
    });

    // ── Step 2: samsung request starts (iphone still pending) ────────────────
    console.log('[Test] Setting search to samsung');
    await act(async () => {
      result.current.setSearchText('samsung');
    });
    // Advance past the 400 ms debounce
    await act(async () => {
      jest.advanceTimersByTime(500);
      await Promise.resolve();
    });

    // ── Step 3: samsung resolves first ───────────────────────────────────────
    console.log('[Test] Resolving samsung');
    await act(async () => {
      resolveSamsung({
        products: [{ id: 2, title: 'Samsung Galaxy', price: 999, discountPercentage: 10, thumbnail: '', images: [], description: '', category: 'phones', rating: 4.5, stock: 50 }],
        total: 1,
      });
      await Promise.resolve();
    });

    // Samsung results should now be in the state
    expect(result.current.products.length).toBe(1);
    expect(result.current.products[0].title).toBe('Samsung Galaxy');

    // ── Step 4: iphone resolves later — stale, must be ignored ───────────────
    console.log('[Test] Resolving iphone');
    await act(async () => {
      resolveIphone({
        products: [{ id: 1, title: 'iPhone 15', price: 1299, discountPercentage: 5, thumbnail: '', images: [], description: '', category: 'phones', rating: 4.8, stock: 30 }],
        total: 1,
      });
      await Promise.resolve();
    });

    // Final state must still be Samsung
    expect(result.current.products.length).toBe(1);
    expect(result.current.products[0].title).toBe('Samsung Galaxy');
  });
});
