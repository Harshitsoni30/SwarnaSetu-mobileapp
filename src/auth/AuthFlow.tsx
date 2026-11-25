import { useState } from 'react';

import {
  forgotPassword,
  login,
  loginWithGoogle,
  loginWithOtp,
  registerAccount,
  requestLoginOtp,
  resetPassword,
  type TokenPair,
} from '../api/auth';
import { requestGoogleIdToken } from './google';
import { HomeScreen } from '../screens/HomeScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { OtpLoginScreen } from '../screens/OtpLoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';

type ScreenName = 'welcome' | 'login' | 'register' | 'forgot' | 'reset' | 'otp' | 'home';

type AuthFlowProps = {
  topInset: number;
};

export function AuthFlow({ topInset }: AuthFlowProps) {
  const [screen, setScreen] = useState<ScreenName>('login');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [tokens, setTokens] = useState<TokenPair | null>(null);

  function show(next: ScreenName) {
    setErrorMessage(null);
    setScreen(next);
  }

  function enter(pair: TokenPair) {
    setTokens(pair);
    show('home');
  }

  async function run(action: () => Promise<void>) {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await action();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'The request failed.');
    } finally {
      setSubmitting(false);
    }
  }

  if (screen === 'home' && tokens) {
    return (
      <HomeScreen
        onSignOut={() => {
          setTokens(null);
          show('login');
        }}
        topInset={topInset}
      />
    );
  }

  if (screen === 'register') {
    return (
      <RegisterScreen
        errorMessage={errorMessage}
        onLogin={() => show('login')}
        onSubmit={(name, email, phone, password) => {
          run(async () => {
            enter(
              await registerAccount({
                name,
                email: blankToNull(email),
                phone: blankToNull(phone),
                password,
              }),
            );
          });
        }}
        submitting={submitting}
        topInset={topInset}
      />
    );
  }

  if (screen === 'forgot') {
    return (
      <ForgotPasswordScreen
        errorMessage={errorMessage}
        onLogin={() => show('login')}
        onSubmit={identifier => {
          run(async () => {
            await forgotPassword(identifier);
            setResetIdentifier(identifier.trim());
            show('reset');
          });
        }}
        submitting={submitting}
        topInset={topInset}
      />
    );
  }

  if (screen === 'reset') {
    return (
      <ResetPasswordScreen
        errorMessage={errorMessage}
        identifier={resetIdentifier}
        onLogin={() => show('login')}
        onSubmit={(otp, oldPassword, newPassword) => {
          run(async () => {
            await resetPassword({
              identifier: resetIdentifier,
              otp,
              old_password: oldPassword,
              new_password: newPassword,
            });
            show('login');
          });
        }}
        submitting={submitting}
        topInset={topInset}
      />
    );
  }

  if (screen === 'otp') {
    return (
      <OtpLoginScreen
        codeSent={codeSent}
        errorMessage={errorMessage}
        initialIdentifier={otpIdentifier}
        onBack={() => show('login')}
        onRequest={identifier => {
          run(async () => {
            await requestLoginOtp(identifier.trim());
            setOtpIdentifier(identifier.trim());
            setCodeSent(true);
          });
        }}
        onSubmit={otp => {
          run(async () => {
            enter(await loginWithOtp(otpIdentifier, otp));
          });
        }}
        submitting={submitting}
        topInset={topInset}
      />
    );
  }

  if (screen === 'welcome') {
    return (
      <WelcomeScreen
        onLogin={() => show('login')}
        onRegister={() => show('register')}
        topInset={topInset}
      />
    );
  }

  return (
    <LoginScreen
      errorMessage={errorMessage}
      onForgot={() => show('forgot')}
      onOtp={identifier => {
        setOtpIdentifier(identifier.trim());
        setCodeSent(false);
        show('otp');
      }}
      onGoogle={() => {
        run(async () => {
          const idToken = await requestGoogleIdToken();
          enter(await loginWithGoogle(idToken));
        });
      }}
      onRegister={() => show('register')}
      onSubmit={(identifier, password) => {
        run(async () => {
          enter(await login({ identifier, password }));
        });
      }}
      submitting={submitting}
      topInset={topInset}
    />
  );
}

function blankToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}
