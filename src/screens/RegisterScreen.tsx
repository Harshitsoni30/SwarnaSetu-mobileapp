import { useState } from 'react';

import lockIcon from '../assets/icons/lock.svg';
import mailIcon from '../assets/icons/mail.svg';
import personIcon from '../assets/icons/person.svg';
import phoneIcon from '../assets/icons/phone.svg';
import { AuthField, AuthFrame, AuthLink } from '../components/AuthFrame';
import { ErrorText, PrimaryButton } from '../components/Screen';

type RegisterScreenProps = {
  topInset: number;
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: (name: string, email: string, phone: string, password: string) => void;
  onLogin: () => void;
};

export function RegisterScreen({
  topInset,
  submitting,
  errorMessage,
  onSubmit,
  onLogin,
}: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  function submit() {
    if (!name.trim()) {
      setLocalError('Enter your name.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    setLocalError(null);
    onSubmit(name.trim(), email, phone, password);
  }

  return (
    <AuthFrame subtitle="Verify  •  Calculate  •  Manage  •  Grow" title="Create account" topInset={topInset}>
      <AuthField autoCapitalize="words" icon={personIcon} label="Full name" onChangeText={setName} value={name} />
      <AuthField icon={mailIcon} label="Email" onChangeText={setEmail} value={email} />
      <AuthField icon={phoneIcon} label="Phone" onChangeText={setPhone} value={phone} />
      <AuthField icon={lockIcon} label="Password" onChangeText={setPassword} secureTextEntry value={password} />
      <AuthField
        icon={lockIcon}
        label="Confirm password"
        onChangeText={setConfirmPassword}
        secureTextEntry
        value={confirmPassword}
      />
      <ErrorText message={localError ?? errorMessage} />
      <PrimaryButton disabled={submitting} label="Create account" onPress={submit} showArrow />
      <AuthLink label="Back to sign in" onPress={onLogin} />
    </AuthFrame>
  );
}
