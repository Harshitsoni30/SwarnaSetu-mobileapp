import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme';

type ScreenProps = {
  topInset: number;
  title: string;
  children: ReactNode;
};

export function Screen({ topInset, title, children }: ScreenProps) {
  return (
    <View testID="screen" style={styles.screen}>
      <View testID="header" style={[styles.header, { paddingTop: topInset }]}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
};

export function Field({ label, value, onChangeText, secureTextEntry = false }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize="none"
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
  showArrow?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  testID = 'primary-action',
  showArrow = false,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.primaryButton, disabled ? styles.primaryButtonDisabled : null]}
      testID={testID}>
      <Text style={styles.primaryButtonText}>{label}</Text>
      {showArrow ? <Text style={styles.primaryButtonText}>→</Text> : null}
    </Pressable>
  );
}

export function TextLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

export function ErrorText({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }
  return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: colors.onPrimary,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  body: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 20,
  },
  field: {
    alignSelf: 'stretch',
    gap: 6,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderColor: colors.gold,
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  link: {
    color: colors.primary,
    fontSize: 15,
    textAlign: 'center',
  },
  error: {
    color: '#9B1C1C',
    fontSize: 14,
    textAlign: 'center',
  },
});
