import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import lockIcon from '../assets/icons/lock.svg';
import { AuthField, AuthFrame, AuthLink } from '../components/AuthFrame';
import { ErrorText, PrimaryButton } from '../components/Screen';
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
    <AuthFrame subtitle="Verify  •  Calculate  •  Manage  •  Grow" title="Reset password" topInset={topInset}>
      {identifier ? <Text style={styles.account}>{identifier}</Text> : null}
      <AuthField icon={lockIcon} label="Reset code" onChangeText={setOtp} value={otp} />
      <AuthField icon={lockIcon} label="Current password" onChangeText={setOldPassword} secureTextEntry value={oldPassword} />
      <AuthField icon={lockIcon} label="New password" onChangeText={setNewPassword} secureTextEntry value={newPassword} />
      <AuthField
        icon={lockIcon}
        label="Confirm new password"
        onChangeText={setConfirmPassword}
        secureTextEntry
        value={confirmPassword}
      />
      <ErrorText message={localError ?? errorMessage} />
      <PrimaryButton disabled={submitting} label="Update password" onPress={submit} showArrow />
      <AuthLink label="Back to sign in" onPress={onLogin} />
    </AuthFrame>
  );
}

const styles = StyleSheet.create({
  account: {
    color: colors.text,
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
  },
});
