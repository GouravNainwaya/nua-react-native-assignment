import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useThemeColors } from '../hooks/useThemeColors';

export function ProductCardSkeleton() {
  const { colors } = useThemeColors();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  const skeletonColor = colors.border; // A neutral gray that works in both themes

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardBackground, borderColor: colors.border },
      ]}
      accessibilityElementsHidden={true}
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View
        style={[
          styles.imageSkeleton,
          { backgroundColor: skeletonColor, opacity },
        ]}
      />
      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.brandSkeleton,
            { backgroundColor: skeletonColor, opacity },
          ]}
        />
        <Animated.View
          style={[
            styles.titleSkeleton,
            { backgroundColor: skeletonColor, opacity },
          ]}
        />
        <Animated.View
          style={[
            styles.titleSkeleton,
            { width: '70%', backgroundColor: skeletonColor, opacity },
          ]}
        />
        <Animated.View
          style={[
            styles.priceSkeleton,
            { backgroundColor: skeletonColor, opacity },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 6,
    minHeight: 120,
    overflow: 'hidden',
    padding: 12,
  },
  imageSkeleton: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingVertical: 4,
  },
  brandSkeleton: {
    height: 12,
    width: '40%',
    borderRadius: 4,
    marginBottom: 8,
  },
  titleSkeleton: {
    height: 16,
    width: '100%',
    borderRadius: 4,
    marginBottom: 6,
  },
  priceSkeleton: {
    height: 20,
    width: '50%',
    borderRadius: 4,
    marginTop: 8,
  },
});
