import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { SearchBar } from '../components/SearchBar';
import { useProductListController } from '../hooks/useProductListController';
import { useThemeColors } from '../hooks/useThemeColors';
import type { RootStackParamList } from '../types/navigation';
import type { Product } from '../types/product';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

export function ProductListScreen({ navigation }: Props) {
  const {
    products,
    total,
    searchText,
    setSearchText,
    isInitialLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    initialError,
    paginationError,
    refreshError,
    loadNextPage,
    refresh,
    retryInitialLoad,
    retryPagination,
  } = useProductListController();

  const { colors } = useThemeColors();

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} />
    ),
    [],
  );

  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return <LoadingState compact label="Loading more products..." />;
    }

    if (paginationError) {
      return (
        <ErrorState
          compact
          title="Could not load more products"
          message={paginationError}
          onAction={retryPagination}
        />
      );
    }

    if (!hasMore && products.length > 0) {
      return <Text style={[styles.endText, { color: colors.textMuted }]}>All {total} products loaded</Text>;
    }

    return null;
  }, [
    hasMore,
    isLoadingMore,
    paginationError,
    products.length,
    retryPagination,
    total,
    colors,
  ]);

  const renderContent = () => {
    if (isInitialLoading && products.length === 0) {
      return (
        <View style={[styles.listContent, { backgroundColor: colors.backgroundSecondary, flex: 1, paddingTop: 6 }]}>
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </View>
      );
    }

    if (initialError) {
      return (
        <View style={styles.centered}>
          <ErrorState
            title="Products are unavailable"
            message={initialError}
            onAction={retryInitialLoad}
          />
        </View>
      );
    }

    if (products.length === 0) {
      return (
        <View style={styles.centered}>
          <EmptyState
            title="No products found"
            message={searchText.trim() ? `No results for "${searchText.trim()}"` : "There are no products available right now."}
          />
        </View>
      );
    }

    return (
      <FlatList
        contentContainerStyle={[styles.listContent, { backgroundColor: colors.backgroundSecondary }]}
        data={products}
        keyExtractor={item => String(item.id)}
        renderItem={renderProduct}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {refreshError && (
              <View style={[styles.refreshErrorBanner, { backgroundColor: colors.danger + '20', borderColor: colors.danger }]}>
                <Text style={[styles.refreshErrorText, { color: colors.danger }]}>{refreshError}</Text>
              </View>
            )}
            {isInitialLoading && products.length > 0 && (
              <View style={styles.searchLoadingContainer}>
                <LoadingState compact label="Searching..." />
              </View>
            )}
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Showing {products.length} of {total}
            </Text>
          </View>
        }
        ListFooterComponent={renderFooter}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.45}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews
        windowSize={7}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Products</Text>
      </View>
      <SearchBar value={searchText} onChangeText={setSearchText} />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  listContent: {
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 4,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  searchLoadingContainer: {
    paddingVertical: 12,
  },
  refreshErrorBanner: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  refreshErrorText: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  endText: {
    fontSize: 14,
    paddingVertical: 18,
    textAlign: 'center',
  },
});
