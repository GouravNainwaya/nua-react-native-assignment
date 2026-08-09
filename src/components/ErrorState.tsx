import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ErrorStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

export function ErrorState({
  title,
  message,
  actionLabel = 'Retry',
  onAction,
  compact = false,
}: ErrorStateProps) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <Text style={[styles.title, compact && styles.compactTitle]}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {onAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
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
  title: {
    color: '#171717',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  compactTitle: {
    fontSize: 15,
  },
  message: {
    color: '#525252',
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0f766e',
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
