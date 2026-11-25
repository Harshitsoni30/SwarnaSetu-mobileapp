import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import lockIcon from '../assets/icons/lock.svg';
import personIcon from '../assets/icons/person.svg';
import { AuthField, AuthFrame, AuthLink } from '../components/AuthFrame';
import { ErrorText, PrimaryButton } from '../components/Screen';
import { colors } from '../theme';

type OtpLoginScreenProps = {
  topInset: number;
  submitting: boolean;
  errorMessage: string | null;
  initialIdentifier: string;
  codeSent: boolean;
  onRequest: (identifier: string) => void;
  onSubmit: (otp: string) => void;
  onBack: () => void;
};

export function OtpLoginScreen({
  topInset,
  submitting,
  errorMessage,
  initialIdentifier,
  codeSent,
  onRequest,
  onSubmit,
  onBack,
}: OtpLoginScreenProps) {
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [otp, setOtp] = useState('');

  return (
    <AuthFrame subtitle="Verify  •  Calculate  •  Manage  •  Grow" title="Login with OTP" topInset={topInset}>
      <AuthField icon={personIcon} label="Mobile Number or Email" onChangeText={setIdentifier} value={identifier} />
      {codeSent ? <AuthField icon={lockIcon} label="Login code" onChangeText={setOtp} value={otp} /> : null}
      {codeSent ? <Text style={styles.note}>Enter the code sent to your phone.</Text> : null}
      {codeSent ? (
        <Pressable
          accessibilityRole="button"
          disabled={submitting}
          onPress={() => onRequest(identifier)}
          style={styles.resendWrap}>
          <Text style={styles.resend}>Resend code</Text>
        </Pressable>
      ) : null}
      <ErrorText message={errorMessage} />
      {codeSent ? (
        <PrimaryButton disabled={submitting} label="Login" onPress={() => onSubmit(otp)} showArrow />
      ) : (
        <PrimaryButton disabled={submitting} label="Send code" onPress={() => onRequest(identifier)} showArrow />
      )}
      <AuthLink label="Back to sign in" onPress={onBack} />
    </AuthFrame>
  );
}

const styles = StyleSheet.create({
  note: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  resendWrap: {
    marginBottom: 12,
  },
  resend: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
