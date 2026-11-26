import { calculateInterest, formatTenure, parseDate, tenureBetween } from './calculate';

const DATES = { fromDate: '01/01/2026', toDate: '01/01/2027' };

test('should charge 200 each month when the amount is 10000 at 2 percent', () => {
  const outcome = calculateInterest({
    amount: 10000,
    monthlyRate: 2,
    fromDate: '01/01/2026',
    toDate: '01/02/2026',
    mode: 'simple',
    interval: 'yearly',
  });

  expect(outcome.ok).toBe(true);
  if (!outcome.ok) {
    return;
  }
  expect(outcome.result.months).toBe(1);
  expect(outcome.result.perMonth).toBe(200);
  expect(outcome.result.interest).toBe(200);
  expect(outcome.result.total).toBe(10200);
});

test('should add twelve monthly charges when the dates span a year', () => {
  const outcome = calculateInterest({
    amount: 10000,
    monthlyRate: 2,
    ...DATES,
    mode: 'simple',
    interval: 'yearly',
  });

  expect(outcome.ok && outcome.result).toEqual({
    months: 12,
    perMonth: 200,
    interest: 2400,
    total: 12400,
    tenure: { years: 1, months: 0, days: 0 },
  });
});

test('should compound yearly at the same total as simple interest for one year', () => {
  const outcome = calculateInterest({
    amount: 10000,
    monthlyRate: 2,
    ...DATES,
    mode: 'compound',
    interval: 'yearly',
  });

  expect(outcome.ok && outcome.result.interest).toBe(2400);
  expect(outcome.ok && outcome.result.total).toBe(12400);
});

test('should compound quarterly across twelve months', () => {
  const outcome = calculateInterest({
    amount: 10000,
    monthlyRate: 2,
    ...DATES,
    mode: 'compound',
    interval: 'quarterly',
  });

  expect(outcome.ok && outcome.result.interest).toBe(2625);
  expect(outcome.ok && outcome.result.total).toBe(12625);
});

test('should compound every six months across twelve months', () => {
  const outcome = calculateInterest({
    amount: 10000,
    monthlyRate: 2,
    ...DATES,
    mode: 'compound',
    interval: 'half',
  });

  expect(outcome.ok && outcome.result.interest).toBe(2544);
  expect(outcome.ok && outcome.result.total).toBe(12544);
});

test('should reject a to date before the from date', () => {
  const outcome = calculateInterest({
    amount: 10000,
    monthlyRate: 2,
    fromDate: '01/02/2026',
    toDate: '01/01/2026',
    mode: 'simple',
    interval: 'yearly',
  });

  expect(outcome).toEqual({ ok: false, error: 'reversed_date' });
});

test('should charge nothing when both dates are in the same month', () => {
  const outcome = calculateInterest({
    amount: 10000,
    monthlyRate: 2,
    fromDate: '01/01/2026',
    toDate: '20/01/2026',
    mode: 'simple',
    interval: 'yearly',
  });

  expect(outcome.ok && outcome.result.months).toBe(0);
  expect(outcome.ok && outcome.result.interest).toBe(0);
  expect(outcome.ok && outcome.result.total).toBe(10000);
  expect(outcome.ok && outcome.result.tenure).toEqual({ years: 0, months: 0, days: 19 });
});

test('should describe a span as years, months, and days', () => {
  const from = parseDate('01/01/2026');
  const to = parseDate('16/10/2027');
  expect(from).not.toBeNull();
  expect(to).not.toBeNull();
  if (from === null || to === null) {
    return;
  }
  const tenure = tenureBetween(from, to);
  expect(tenure).toEqual({ years: 1, months: 9, days: 15 });
  expect(formatTenure(tenure)).toBe('1 year 9 months 15 days');
});
