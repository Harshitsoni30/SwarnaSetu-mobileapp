import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../theme';

type WelcomeButtonProps = {
  label: string;
  onPress: () => void;
};

export function WelcomeButton({ label, onPress }: WelcomeButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.primary,
    borderRadius: 28,
    borderWidth: 1.5,
    paddingVertical: 14,
  },
  label: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
