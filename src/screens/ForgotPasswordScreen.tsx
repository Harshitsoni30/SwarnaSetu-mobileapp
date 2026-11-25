import { useState } from 'react';

import mailIcon from '../assets/icons/mail.svg';
import { AuthField, AuthFrame, AuthLink } from '../components/AuthFrame';
import { ErrorText, PrimaryButton } from '../components/Screen';

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
    <AuthFrame subtitle="Verify  •  Calculate  •  Manage  •  Grow" title="Forgot password" topInset={topInset}>
      <AuthField
        icon={mailIcon}
        label="Mobile Number or Email"
        onChangeText={setIdentifier}
        value={identifier}
      />
      <ErrorText message={errorMessage} />
      <PrimaryButton disabled={submitting} label="Send code" onPress={() => onSubmit(identifier)} showArrow />
      <AuthLink label="Back to sign in" onPress={onLogin} />
    </AuthFrame>
  );
}
