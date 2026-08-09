import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { CartButton } from '../components/CartButton';
import { ThemeToggleButton } from '../components/ThemeToggleButton';
import { useCartPersistence } from '../hooks/useCartPersistence';
import { useThemeColors } from '../hooks/useThemeColors';
import { useThemePersistence } from '../hooks/useThemePersistence';
import { CartScreen } from '../screens/CartScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { ProductListScreen } from '../screens/ProductListScreen';
import { ReturnPolicyScreen } from '../screens/ReturnPolicyScreen';
import type { RootStackParamList } from '../types/navigation';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  useCartPersistence();
  const { isDark, colors } = useThemeColors();
  
  // Initialize theme persistence
  useThemePersistence();

  const navigationTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator 
        initialRouteName={ROUTES.PRODUCT_LIST}
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', gap: 12 }}>
              <ThemeToggleButton />
              <CartButton />
            </View>
          ),
        }}
      >
        <Stack.Screen
          name={ROUTES.PRODUCT_LIST}
          component={ProductListScreen}
          options={{ title: 'Products' }}
        />
        <Stack.Screen
          name={ROUTES.PRODUCT_DETAIL}
          component={ProductDetailScreen}
          options={{ title: 'Product Details' }}
        />
        <Stack.Screen
          name={ROUTES.CART}
          component={CartScreen}
          options={{ title: 'Cart' }}
        />
        <Stack.Screen
          name={ROUTES.RETURN_POLICY}
          component={ReturnPolicyScreen}
          options={{ title: 'Return Policy' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
