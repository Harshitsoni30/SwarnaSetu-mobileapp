import { useState } from 'react';

import {
  forgotPassword,
  login,
  loginWithGoogle,
  registerAccount,
  resetPassword,
  type TokenPair,
} from '../api/auth';
import { requestGoogleIdToken } from './google';
import { HomeScreen } from '../screens/HomeScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';

type ScreenName = 'login' | 'register' | 'forgot' | 'reset' | 'home';

type AuthFlowProps = {
  topInset: number;
};

export function AuthFlow({ topInset }: AuthFlowProps) {
  const [screen, setScreen] = useState<ScreenName>('login');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetIdentifier, setResetIdentifier] = useState('');
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
        onSubmit={(email, phone, password) => {
          run(async () => {
            enter(
              await registerAccount({
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

  return (
    <LoginScreen
      errorMessage={errorMessage}
      onForgot={() => show('forgot')}
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
