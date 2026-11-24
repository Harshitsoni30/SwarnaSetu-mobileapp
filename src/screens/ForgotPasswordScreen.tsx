import { useState } from 'react';

import { ErrorText, Field, PrimaryButton, Screen, TextLink } from '../components/Screen';

type ForgotPasswordScreenProps = {
  topInset: number;
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: (identifier: string) => void;
  onLogin: () => void;
};

export function ForgotPasswordScreen({
  topInset,
  submitting,
  errorMessage,
  onSubmit,
  onLogin,
}: ForgotPasswordScreenProps) {
  const [identifier, setIdentifier] = useState('');

  return (
    <Screen title="Forgot password" topInset={topInset}>
      <Field label="Email or phone" onChangeText={setIdentifier} value={identifier} />
      <ErrorText message={errorMessage} />
      <PrimaryButton
        disabled={submitting}
        label="Send code"
        onPress={() => onSubmit(identifier)}
      />
      <TextLink label="Back to sign in" onPress={onLogin} />
    </Screen>
  );
}
