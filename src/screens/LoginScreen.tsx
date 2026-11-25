import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import eyeIcon from '../assets/icons/eye.svg';
import lockIcon from '../assets/icons/lock.svg';
import personIcon from '../assets/icons/person.svg';
import phoneIcon from '../assets/icons/phone.svg';
import { AuthField, AuthFrame } from '../components/AuthFrame';
import { imageSource } from '../components/imageSource';
import { ErrorText, PrimaryButton } from '../components/Screen';
import { colors } from '../theme';

type LoginScreenProps = {
  topInset: number;
  submitting: boolean;
  errorMessage: string | null;
  onSubmit: (identifier: string, password: string) => void;
  onRegister: () => void;
  onForgot: () => void;
  onGoogle?: () => void;
  onOtp?: (identifier: string) => void;
};

export function LoginScreen({
  topInset,
  submitting,
  errorMessage,
  onSubmit,
  onRegister,
  onForgot,
  onOtp,
}: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthFrame
      subtitle="Verify  •  Calculate  •  Manage  •  Grow"
      title="Welcome"
      topInset={topInset}>
      <AuthField
        icon={personIcon}
        label="Mobile Number or Email"
        onChangeText={setIdentifier}
        value={identifier}
      />
      <AuthField
        icon={lockIcon}
        label="Password"
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        trailing={
          <Pressable accessibilityLabel="Show password" onPress={() => setShowPassword(value => !value)}>
            <Image source={imageSource(eyeIcon)} style={styles.icon} />
          </Pressable>
        }
        value={password}
      />
      <Pressable accessibilityRole="button" onPress={onForgot} style={styles.forgotWrap}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </Pressable>
      <ErrorText message={errorMessage} />
      <PrimaryButton disabled={submitting} label="Login" onPress={() => onSubmit(identifier, password)} showArrow />
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>
      <Pressable accessibilityRole="button" onPress={() => onOtp?.(identifier)} style={styles.otpButton}>
        <Image source={imageSource(phoneIcon)} style={styles.icon} />
        <Text style={styles.otpText}>Continue with OTP</Text>
      </Pressable>
      <Text style={styles.accountLine}>
        Don't have an account?{' '}
        <Text onPress={onRegister} style={styles.registerNow}>
          Register Now
        </Text>
      </Text>
    </AuthFrame>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 20,
    width: 20,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: 4,
    marginTop: 2,
  },
  forgot: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  dividerLine: {
    backgroundColor: colors.line,
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: '#8A8174',
    fontSize: 12,
    letterSpacing: 1,
  },
  otpButton: {
    alignItems: 'center',
    borderColor: colors.gold,
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  otpText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  accountLine: {
    color: colors.text,
    fontSize: 14,
    marginTop: 18,
    textAlign: 'center',
  },
  registerNow: {
    color: colors.gold,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
