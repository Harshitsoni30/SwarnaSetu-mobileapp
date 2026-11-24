import { googleIosClientId, googleWebClientId } from '../config';

type GoogleSignInModule = {
  GoogleSignin: {
    configure: (options: { webClientId: string; iosClientId?: string }) => void;
    hasPlayServices: (options: { showPlayServicesUpdateDialog: boolean }) => Promise<void>;
    signIn: () => Promise<{ data?: { idToken?: string | null } }>;
  };
};

export async function requestGoogleIdToken(): Promise<string> {
  if (!googleWebClientId) {
    throw new Error('Google sign-in is not configured.');
  }

  const imported = require('@react-native-google-signin/google-signin') as GoogleSignInModule;
  imported.GoogleSignin.configure({
    webClientId: googleWebClientId,
    iosClientId: googleIosClientId || undefined,
  });
  await imported.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await imported.GoogleSignin.signIn();
  const idToken = response.data?.idToken;
  if (!idToken) {
    throw new Error('Google did not return a sign-in token.');
  }
  return idToken;
}
