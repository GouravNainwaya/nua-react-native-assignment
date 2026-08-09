import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Product, ProductsResponse } from '../types/product';
import { withRetry } from '../utils/retry';

interface PaginatedProductsArgs {
  limit: number;
  skip: number;
}

interface SearchProductsArgs extends PaginatedProductsArgs {
  query: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://dummyjson.com',
});

const baseQueryWithRetry: typeof baseQuery = async (args, api, extraOptions) => {
  try {
    return await withRetry(
      async () => {
        const result = await baseQuery(args, api, extraOptions);
        if (result.error) {
          throw result.error;
        }
        return result;
      },
      { maxRetries: 3, baseDelayMs: 500 }
    );
  } catch (error) {
    return { error: error as any };
  }
};

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Products', 'Product'],
  endpoints: builder => ({
    getProducts: builder.query<ProductsResponse, PaginatedProductsArgs>({
      query: ({ limit, skip }) => ({
        url: '/products',
        params: { limit, skip },
      }),
      providesTags: result =>
        result
          ? [
              ...result.products.map(product => ({
                type: 'Product' as const,
                id: product.id,
              })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
    searchProducts: builder.query<ProductsResponse, SearchProductsArgs>({
      query: ({ query, limit, skip }) => ({
        url: '/products/search',
        params: { q: query, limit, skip },
      }),
      providesTags: result =>
        result
          ? [
              ...result.products.map(product => ({
                type: 'Product' as const,
                id: product.id,
              })),
              { type: 'Products', id: 'SEARCH' },
            ]
          : [{ type: 'Products', id: 'SEARCH' }],
    }),
    getProductById: builder.query<Product, number>({
      query: id => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useLazyGetProductsQuery,
  useLazySearchProductsQuery,
} = productsApi;
