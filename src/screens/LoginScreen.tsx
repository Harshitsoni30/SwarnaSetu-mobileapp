import { useState } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';

import { ErrorText, Field, PrimaryButton, Screen, TextLink } from '../components/Screen';
import { colors } from '../theme';

type LoginScreenProps = {
  topInset: number;
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: (identifier: string, password: string) => void;
  onRegister: () => void;
  onForgot: () => void;
  onGoogle: () => void;
};

export function LoginScreen({
  topInset,
  submitting,
  errorMessage,
  onSubmit,
  onRegister,
  onForgot,
  onGoogle,
}: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Screen title="Sign in" topInset={topInset}>
      <Field label="Email or phone" onChangeText={setIdentifier} value={identifier} />
      <Field label="Password" onChangeText={setPassword} secureTextEntry value={password} />
      <ErrorText message={errorMessage} />
      <PrimaryButton
        disabled={submitting}
        label="Sign in"
        onPress={() => onSubmit(identifier, password)}
      />
      <Pressable accessibilityRole="button" onPress={onGoogle} style={styles.googleButton} testID="google-sign-in">
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </Pressable>
      <TextLink label="Create an account" onPress={onRegister} />
      <TextLink label="Forgot password" onPress={onForgot} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 12,
  },
  googleButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
