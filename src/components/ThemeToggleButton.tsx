import { StyleSheet, Switch, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { selectThemeMode } from '../store/themeSelectors';
import { setThemeMode } from '../store/themeSlice';

export function ThemeToggleButton() {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === 'dark';

  const toggleTheme = () => {
    dispatch(setThemeMode(isDark ? 'light' : 'dark'));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{isDark ? '🌙' : '☀️'}</Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{ false: '#d1d5db', true: '#4b5563' }}
        thumbColor={isDark ? '#f9fafb' : '#ffffff'}
        ios_backgroundColor="#d1d5db"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 16,
  },
});
