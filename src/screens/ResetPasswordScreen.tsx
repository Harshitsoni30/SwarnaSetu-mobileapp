import { useState } from 'react';
import { Text, StyleSheet } from 'react-native';

import { ErrorText, Field, PrimaryButton, Screen, TextLink } from '../components/Screen';
import { colors } from '../theme';

type ResetPasswordScreenProps = {
  topInset: number;
  identifier: string;
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: (otp: string, oldPassword: string, newPassword: string) => void;
  onLogin: () => void;
};

export function ResetPasswordScreen({
  topInset,
  identifier,
  submitting,
  errorMessage,
  onSubmit,
  onLogin,
}: ResetPasswordScreenProps) {
  const [otp, setOtp] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  function submit() {
    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    setLocalError(null);
    onSubmit(otp, oldPassword, newPassword);
  }

  return (
    <Screen title="Reset password" topInset={topInset}>
      <Text style={styles.account}>{identifier}</Text>
      <Field label="Reset code" onChangeText={setOtp} value={otp} />
      <Field label="Current password" onChangeText={setOldPassword} secureTextEntry value={oldPassword} />
      <Field label="New password" onChangeText={setNewPassword} secureTextEntry value={newPassword} />
      <Field
        label="Confirm new password"
        onChangeText={setConfirmPassword}
        secureTextEntry
        value={confirmPassword}
      />
      <ErrorText message={localError ?? errorMessage} />
      <PrimaryButton disabled={submitting} label="Update password" onPress={submit} />
      <TextLink label="Back to sign in" onPress={onLogin} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  account: {
    color: colors.text,
    fontSize: 16,
  },
});
