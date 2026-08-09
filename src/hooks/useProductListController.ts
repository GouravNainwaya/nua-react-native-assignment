import { useCallback, useEffect, useRef, useState } from 'react';

import { useLazyGetProductsQuery, useLazySearchProductsQuery } from '../api/productsApi';
import { analytics } from '../services/analytics';
import type { Product } from '../types/product';
import { useDebounce } from './useDebounce';

const PAGE_SIZE = 20;

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error && 'status' in error) {
    return 'Unable to load products. Please try again.';
  }

  return 'Something went wrong. Please try again.';
};

export function useProductListController() {
  const [fetchProducts] = useLazyGetProductsQuery();
  const [searchProducts] = useLazySearchProductsQuery();
  
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 400);

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialError, setInitialError] = useState<string | null>(null);
  const [paginationError, setPaginationError] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  
  const isLoadingMoreRef = useRef(false);
  const sessionIdRef = useRef(0);

  const loadFirstPage = useCallback(async (isRefresh = false) => {
    const sessionId = ++sessionIdRef.current;
    
    isLoadingMoreRef.current = false;
    setIsLoadingMore(false);
    setPaginationError(null);

    if (isRefresh) {
      setIsRefreshing(true);
      setIsInitialLoading(false);
      setRefreshError(null);
    } else {
      setIsInitialLoading(true);
      setIsRefreshing(false);
      setInitialError(null);
    }

    const currentQuery = debouncedSearchText.trim();

    try {
      let response;
      const apiCall = currentQuery
        ? searchProducts({
            query: currentQuery,
            limit: PAGE_SIZE,
            skip: 0,
          }).unwrap()
        : fetchProducts({
            limit: PAGE_SIZE,
            skip: 0,
          }).unwrap();

      if (isRefresh) {
        // Enforce a minimum 800ms delay to ensure the native spinner is visible
        // and doesn't get batched out by React 18 on instant cache/network responses.
        const [res] = await Promise.all([
          apiCall,
          new Promise(resolve => setTimeout(resolve, 800)),
        ]);
        response = res;
      } else {
        response = await apiCall;
      }

      if (sessionId !== sessionIdRef.current) {
        return;
      }

      if (currentQuery) {
        analytics.track('search_performed', {
          query: currentQuery,
          resultCount: response.total,
        });
      }

      setProducts(response.products);
      setTotal(response.total);
      setHasMore(response.products.length < response.total);
      
      if (isRefresh) {
        setInitialError(null);
      }
    } catch (error) {
      if (sessionId !== sessionIdRef.current) {
        return;
      }

      if (isRefresh) {
        setRefreshError(getErrorMessage(error));
      } else {
        setInitialError(getErrorMessage(error));
        setProducts([]);
        setTotal(0);
        setHasMore(true);
      }
    } finally {
      if (sessionId === sessionIdRef.current) {
        setIsRefreshing(false);
        setIsInitialLoading(false);
      }
    }
  }, [debouncedSearchText, fetchProducts, searchProducts]);

  const loadNextPage = useCallback(async () => {
    if (
      isInitialLoading ||
      isRefreshing ||
      isLoadingMoreRef.current ||
      !hasMore ||
      products.length === 0
    ) {
      return;
    }

    const sessionId = sessionIdRef.current;

    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    setPaginationError(null);

    const currentQuery = debouncedSearchText.trim();

    try {
      let response;
      if (currentQuery) {
        response = await searchProducts({
          query: currentQuery,
          limit: PAGE_SIZE,
          skip: products.length,
        }).unwrap();
      } else {
        response = await fetchProducts({
          limit: PAGE_SIZE,
          skip: products.length,
        }).unwrap();
      }

      if (sessionId !== sessionIdRef.current) {
        return;
      }

      const nextProducts = [...products, ...response.products];
      setProducts(nextProducts);
      setTotal(response.total);
      setHasMore(
        response.products.length > 0 && nextProducts.length < response.total,
      );
    } catch (error) {
      if (sessionId !== sessionIdRef.current) {
        return;
      }

      setPaginationError(getErrorMessage(error));
    } finally {
      if (sessionId === sessionIdRef.current) {
        isLoadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, [
    debouncedSearchText,
    fetchProducts,
    hasMore,
    isInitialLoading,
    isRefreshing,
    products,
    searchProducts,
  ]);
  
  useEffect(() => {
    loadFirstPage(false);
  }, [loadFirstPage]);

  const refresh = useCallback(() => loadFirstPage(true), [loadFirstPage]);

  return {
    searchText,
    setSearchText,
    products,
    total,
    hasMore,
    isInitialLoading,
    isLoadingMore,
    isRefreshing,
    initialError,
    paginationError,
    refreshError,
    loadNextPage,
    refresh,
    retryInitialLoad: () => loadFirstPage(false),
    retryPagination: loadNextPage,
  };
}
