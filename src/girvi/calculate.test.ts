import { calculateGirvi, formatGirviShare, formatRupees } from './calculate';

const GOLD = {
  metal: 'gold' as const,
  weight: 10,
  weightUnit: 'gram' as const,
  purity: 90,
  rate: 100000,
  rateUnit: 'per10' as const,
  loanPercent: 70,
};

test('should give 63000 when 10 gram gold is 90 percent pure at 100000 per 10 gram and 70 percent', () => {
  const outcome = calculateGirvi(GOLD);

  expect(outcome.ok).toBe(true);
  if (!outcome.ok) {
    return;
  }
  expect(outcome.result.actualValue).toBe(90000);
  expect(outcome.result.loanAmount).toBe(63000);
  expect(outcome.result.weightLabel).toBe('10 Gram');
  expect(outcome.result.rateLabel).toBe(`${formatRupees(100000)} per 10 Gram`);
  expect(outcome.result.shareText).toBe(
    formatGirviShare({
      metalLabel: 'Gold',
      weightLabel: '10 Gram',
      purityLabel: '90%',
      rateLabel: outcome.result.rateLabel,
      actualValue: 90000,
      loanPercentLabel: '70%',
      loanAmount: 63000,
    }),
  );
});

test('should use the entered rate when the market rate is per gram', () => {
  const outcome = calculateGirvi({ ...GOLD, rate: 10000, rateUnit: 'perGram' });

  expect(outcome.ok).toBe(true);
  if (!outcome.ok) {
    return;
  }
  expect(outcome.result.actualValue).toBe(90000);
  expect(outcome.result.loanAmount).toBe(63000);
});

test('should divide a per kilogram rate by 1000', () => {
  const outcome = calculateGirvi({
    ...GOLD,
    metal: 'silver',
    rateUnit: 'perKg',
  });

  expect(outcome.ok).toBe(true);
  if (!outcome.ok) {
    return;
  }
  expect(outcome.result.metalLabel).toBe('Silver');
  expect(outcome.result.actualValue).toBe(900);
  expect(outcome.result.loanAmount).toBe(630);
  expect(outcome.result.rateLabel).toContain('per Kg');
});

test('should convert kilograms to grams before applying the rate', () => {
  const outcome = calculateGirvi({
    ...GOLD,
    weight: 1,
    weightUnit: 'kg',
    purity: 100,
    rate: 100000,
    rateUnit: 'perKg',
    loanPercent: 50,
  });

  expect(outcome.ok).toBe(true);
  if (!outcome.ok) {
    return;
  }
  expect(outcome.result.weightLabel).toBe('1 Kg');
  expect(outcome.result.actualValue).toBe(100000);
  expect(outcome.result.loanAmount).toBe(50000);
});

test('should round the jewellery value to the nearest rupee before the loan percentage', () => {
  const outcome = calculateGirvi({
    ...GOLD,
    weight: 1,
    purity: 33,
    rate: 100,
    rateUnit: 'perGram',
    loanPercent: 50,
  });

  expect(outcome.ok).toBe(true);
  if (!outcome.ok) {
    return;
  }
  expect(outcome.result.actualValue).toBe(33);
  expect(outcome.result.loanAmount).toBe(17);
});

test('should reject weight, rate, purity, and loan percentage outside the allowed range', () => {
  expect(calculateGirvi({ ...GOLD, weight: 0 })).toEqual({ ok: false, error: 'invalid_weight' });
  expect(calculateGirvi({ ...GOLD, weight: Number.NaN })).toEqual({ ok: false, error: 'invalid_weight' });
  expect(calculateGirvi({ ...GOLD, rate: 0 })).toEqual({ ok: false, error: 'invalid_rate' });
  expect(calculateGirvi({ ...GOLD, purity: 101 })).toEqual({ ok: false, error: 'invalid_purity' });
  expect(calculateGirvi({ ...GOLD, loanPercent: -1 })).toEqual({ ok: false, error: 'invalid_loan' });
});
