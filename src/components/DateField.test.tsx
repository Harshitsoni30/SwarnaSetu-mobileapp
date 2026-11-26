import React from 'react';
import { ScrollView } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { DateField } from './DateField';

test('should insert a slash after two day digits', async () => {
  const onChange = jest.fn();
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<DateField label="From date" onChange={onChange} value="" />);
  });

  await ReactTestRenderer.act(() => {
    renderer?.root.findByProps({ accessibilityLabel: 'From date' }).props.onChangeText('12');
  });

  expect(onChange).toHaveBeenCalledWith('12/');
});

test('should set the wheeled day as DD/MM/YYYY', async () => {
  const onChange = jest.fn();
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<DateField label="From date" onChange={onChange} value="01/01/2026" />);
  });

  await ReactTestRenderer.act(() => {
    renderer?.root.findByProps({ accessibilityLabel: 'Open From date picker' }).props.onPress();
  });

  await ReactTestRenderer.act(() => {
    renderer?.root.findByProps({ accessibilityLabel: 'Day 16' }).props.onPress();
  });

  await ReactTestRenderer.act(() => {
    renderer?.root.findByProps({ accessibilityLabel: 'Done' }).props.onPress();
  });

  expect(onChange).toHaveBeenCalledWith('16/01/2026');
});

test('should select the centered day when the wheel scrolls', async () => {
  const onChange = jest.fn();
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<DateField label="From date" onChange={onChange} value="01/01/2026" />);
  });

  await ReactTestRenderer.act(() => {
    renderer?.root.findByProps({ accessibilityLabel: 'Open From date picker' }).props.onPress();
  });

  await ReactTestRenderer.act(async () => {
    await new Promise(resolve => setTimeout(resolve, 70));
  });

  await ReactTestRenderer.act(() => {
    renderer?.root.findAllByType(ScrollView)[0]?.props.onScroll({
      nativeEvent: { contentOffset: { y: 15 * 36 } },
    });
  });

  await ReactTestRenderer.act(() => {
    renderer?.root.findByProps({ accessibilityLabel: 'Done' }).props.onPress();
  });

  expect(onChange).toHaveBeenCalledWith('16/01/2026');
});
