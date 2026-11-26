import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { GirviLoanScreen } from './GirviLoanScreen';

function press(renderer: ReactTestRenderer.ReactTestRenderer | undefined, label: string) {
  const buttons = renderer?.root.findAll(node => node.props.accessibilityRole === 'button' && node.props.onPress) ?? [];
  const match = buttons.find(node => {
    const text = node.findAllByType('Text' as never);
    return text.some(item => String(item.props.children) === label);
  });
  return match;
}

test('should show 90000 jewellery value and 63000 loan for 10 gram gold at 90 percent', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<GirviLoanScreen topInset={0} />);
  });

  const input = (label: string) => renderer?.root.findByProps({ accessibilityLabel: label });
  await ReactTestRenderer.act(() => {
    input('Weight')?.props.onChangeText('10');
    input('Purity')?.props.onChangeText('90');
    input('Market Rate (Bhav)')?.props.onChangeText('100000');
    input('Loan Percentage')?.props.onChangeText('70');
  });

  await ReactTestRenderer.act(() => {
    press(renderer, 'Calculate Loan Amount')?.props.onPress();
  });

  const calculated = JSON.stringify(renderer?.toJSON());
  expect(calculated).toContain('90,000');
  expect(calculated).toContain('63,000');

  await ReactTestRenderer.act(() => {
    press(renderer, 'Recalculate')?.props.onPress();
  });

  const again = JSON.stringify(renderer?.toJSON());
  expect(again).toContain('Calculate Loan Amount');
});

test('should keep silver weight in grams and set the market rate to per kilogram', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<GirviLoanScreen topInset={0} />);
  });

  await ReactTestRenderer.act(() => {
    press(renderer, 'Silver')?.props.onPress();
  });

  const silver = JSON.stringify(renderer?.toJSON());
  expect(silver).toContain('Gram');
  expect(silver).toContain('Per Kg');
  expect(silver).not.toContain('Per 10 Gram');

  await ReactTestRenderer.act(() => {
    press(renderer, 'Gold')?.props.onPress();
  });

  const gold = JSON.stringify(renderer?.toJSON());
  expect(gold).toContain('Gram');
  expect(gold).toContain('Per 10 Gram');
  expect(gold).not.toContain('Per Kg');
});
