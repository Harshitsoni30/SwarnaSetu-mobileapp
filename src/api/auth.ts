import { postJson } from './client';

export type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
};

export function registerAccount(input: {
  name: string;
  email: string | null;
  phone: string | null;
  password: string;
}): Promise<TokenPair> {
  return postJson<TokenPair>('/auth/register', input);
}

export function login(input: { identifier: string; password: string }): Promise<TokenPair> {
  return postJson<TokenPair>('/auth/login', input);
}

export function forgotPassword(identifier: string): Promise<{ message: string }> {
  return postJson('/auth/forgot-password', { identifier });
}

export function resetPassword(input: {
  identifier: string;
  otp: string;
  old_password: string;
  new_password: string;
}): Promise<{ message: string }> {
  return postJson('/auth/reset-password', input);
}

export function loginWithGoogle(idToken: string): Promise<TokenPair> {
  return postJson<TokenPair>('/auth/google', { id_token: idToken });
}

export function requestLoginOtp(identifier: string): Promise<{ message: string }> {
  return postJson('/auth/otp/request', { identifier });
}

export function loginWithOtp(identifier: string, otp: string): Promise<TokenPair> {
  return postJson<TokenPair>('/auth/otp/login', { identifier, otp });
}
