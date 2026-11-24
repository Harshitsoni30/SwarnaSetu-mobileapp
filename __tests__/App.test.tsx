/**
 * @format
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import App from '../App';
import { LoginScreen } from '../src/screens/LoginScreen';
import { HomeScreen } from '../src/screens/HomeScreen';
import { colors } from '../src/theme';

test('renders a white screen with a blue header', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<HomeScreen topInset={0} />);
  });

  const screen = renderer?.root.findByProps({ testID: 'screen' });
  const header = renderer?.root.findByProps({ testID: 'header' });

  expect(StyleSheet.flatten(screen?.props.style).backgroundColor).toBe(colors.background);
  expect(StyleSheet.flatten(header?.props.style).backgroundColor).toBe(colors.primary);
});

test('renders a white login screen with a blue action', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <LoginScreen
        errorMessage={null}
        onForgot={() => undefined}
        onGoogle={() => undefined}
        onRegister={() => undefined}
        onSubmit={() => undefined}
        submitting={false}
        topInset={0}
      />,
    );
  });

  const screen = renderer?.root.findByProps({ testID: 'screen' });
  const action = renderer?.root.findByProps({ testID: 'primary-action' });

  expect(StyleSheet.flatten(screen?.props.style).backgroundColor).toBe(colors.background);
  expect(StyleSheet.flatten(action?.props.style).backgroundColor).toBe(colors.primary);
});

test('renders the app shell', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
