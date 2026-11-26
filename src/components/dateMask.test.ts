import { maskDate } from './dateMask';

test('should insert a slash after the day and the month', () => {
  expect(maskDate('1', '')).toBe('1');
  expect(maskDate('12', '1')).toBe('12/');
  expect(maskDate('12/1', '12/')).toBe('12/1');
  expect(maskDate('12/12', '12/1')).toBe('12/12/');
  expect(maskDate('12/12/2026', '12/12/')).toBe('12/12/2026');
});

test('should keep a pasted date in DD/MM/YYYY', () => {
  expect(maskDate('12012026', '')).toBe('12/01/2026');
});

test('should allow deleting the slash', () => {
  expect(maskDate('12', '12/')).toBe('12');
  expect(maskDate('12/01', '12/01/')).toBe('12/01');
});

test('should add the slash when a full date is replaced with a day', () => {
  expect(maskDate('12', '09/01/2026')).toBe('12/');
});
