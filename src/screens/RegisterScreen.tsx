import { useState } from 'react';

import { ErrorText, Field, PrimaryButton, Screen, TextLink } from '../components/Screen';

type RegisterScreenProps = {
  topInset: number;
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: (email: string, phone: string, password: string) => void;
  onLogin: () => void;
};

export function RegisterScreen({
  topInset,
  submitting,
  errorMessage,
  onSubmit,
  onLogin,
}: RegisterScreenProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  function submit() {
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    setLocalError(null);
    onSubmit(email, phone, password);
  }

  return (
    <Screen title="Create account" topInset={topInset}>
      <Field label="Email" onChangeText={setEmail} value={email} />
      <Field label="Phone" onChangeText={setPhone} value={phone} />
      <Field label="Password" onChangeText={setPassword} secureTextEntry value={password} />
      <Field
        label="Confirm password"
        onChangeText={setConfirmPassword}
        secureTextEntry
        value={confirmPassword}
      />
      <ErrorText message={localError ?? errorMessage} />
      <PrimaryButton disabled={submitting} label="Create account" onPress={submit} />
      <TextLink label="Back to sign in" onPress={onLogin} />
    </Screen>
  );
}
