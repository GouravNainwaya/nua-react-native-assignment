import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingStateProps {
  label?: string;
  compact?: boolean;
}

export function LoadingState({ label = 'Loading products...', compact = false }: LoadingStateProps) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <ActivityIndicator color="#0f766e" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  compact: {
    paddingVertical: 16,
  },
  label: {
    color: '#525252',
    fontSize: 15,
    marginTop: 10,
  },
});
