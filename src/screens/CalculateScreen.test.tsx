import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { DateField } from '../components/DateField';
import { CalculateScreen } from './CalculateScreen';

test('should show 2400 interest and 12400 payable for 10000 at 2 percent over 12 months', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<CalculateScreen onBack={() => undefined} topInset={0} />);
  });

  const input = (label: string) => renderer?.root.findByProps({ accessibilityLabel: label });
  await ReactTestRenderer.act(() => {
    input('Loan Amount')?.props.onChangeText('10000');
    input('Interest Rate (per month)')?.props.onChangeText('2');
    const dates = renderer?.root.findAllByType(DateField) ?? [];
    dates[0]?.props.onChange('01/01/2026');
    dates[1]?.props.onChange('01/01/2027');
  });

  const button = renderer?.root.findAll(node => node.props.accessibilityRole === 'button' && node.props.onPress) ?? [];
  const calculate = button.find(node => {
    const text = node.findAllByType('Text' as never);
    return text.some(item => String(item.props.children).includes('Calculate Interest'));
  });

  await ReactTestRenderer.act(() => {
    calculate?.props.onPress();
  });

  const text = JSON.stringify(renderer?.toJSON());
  expect(text).toContain('2,400');
  expect(text).toContain('12,400');
  expect(text).toContain('1 year');
});
