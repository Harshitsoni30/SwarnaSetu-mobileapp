export type Metal = 'gold' | 'silver';
export type WeightUnit = 'gram' | 'kg';
export type RateUnit = 'per10' | 'perGram' | 'perKg';

export type GirviInput = {
  metal: Metal;
  weight: number;
  weightUnit: WeightUnit;
  purity: number;
  rate: number;
  rateUnit: RateUnit;
  loanPercent: number;
};

export type GirviError = 'invalid_weight' | 'invalid_rate' | 'invalid_purity' | 'invalid_loan';

export type GirviResult = {
  metalLabel: string;
  weightLabel: string;
  purityLabel: string;
  rateLabel: string;
  actualValue: number;
  loanPercentLabel: string;
  loanAmount: number;
  shareText: string;
};

const money = new Intl.NumberFormat('en-IN', {
  currency: 'INR',
  maximumFractionDigits: 0,
  style: 'currency',
});

const RATE_LABEL: Record<RateUnit, string> = {
  per10: 'per 10 Gram',
  perGram: 'per Gram',
  perKg: 'per Kg',
};

/** Rupee amount in Indian grouping, rounded to the nearest rupee. */
export function formatRupees(amount: number): string {
  return money.format(amount);
}

/** Text shared from a finished girvi calculation. */
export function formatGirviShare(result: Omit<GirviResult, 'shareText'>): string {
  return [
    'Girvi loan',
    `${result.metalLabel}, ${result.weightLabel}, ${result.purityLabel} purity`,
    `Market rate ${result.rateLabel}`,
    `Jewellery value ${formatRupees(result.actualValue)}`,
    `Loan ${result.loanPercentLabel}: ${formatRupees(result.loanAmount)}`,
  ].join('\n');
}

function ratePerGram(rate: number, unit: RateUnit): number {
  if (unit === 'per10') {
    return rate / 10;
  }
  if (unit === 'perKg') {
    return rate / 1000;
  }
  return rate;
}

function amountLabel(value: number): string {
  return String(value);
}

/**
 * Loan a shop can give against gold or silver.
 * Weight in kilograms is converted to grams. A per-10-gram rate is divided by 10,
 * and a per-kilogram rate is divided by 1000, before purity is applied.
 */
export function calculateGirvi(
  input: GirviInput,
): { ok: true; result: GirviResult } | { ok: false; error: GirviError } {
  if (!Number.isFinite(input.weight) || !(input.weight > 0)) {
    return { ok: false, error: 'invalid_weight' };
  }
  if (!Number.isFinite(input.rate) || !(input.rate > 0)) {
    return { ok: false, error: 'invalid_rate' };
  }
  if (!Number.isFinite(input.purity) || input.purity < 0 || input.purity > 100) {
    return { ok: false, error: 'invalid_purity' };
  }
  if (!Number.isFinite(input.loanPercent) || input.loanPercent < 0 || input.loanPercent > 100) {
    return { ok: false, error: 'invalid_loan' };
  }

  const grams = input.weightUnit === 'kg' ? input.weight * 1000 : input.weight;
  const actualValue = Math.round(grams * (input.purity / 100) * ratePerGram(input.rate, input.rateUnit));
  const loanAmount = Math.round(actualValue * (input.loanPercent / 100));
  const details = {
    metalLabel: input.metal === 'gold' ? 'Gold' : 'Silver',
    weightLabel: `${amountLabel(input.weight)} ${input.weightUnit === 'kg' ? 'Kg' : 'Gram'}`,
    purityLabel: `${amountLabel(input.purity)}%`,
    rateLabel: `${formatRupees(input.rate)} ${RATE_LABEL[input.rateUnit]}`,
    actualValue,
    loanPercentLabel: `${amountLabel(input.loanPercent)}%`,
    loanAmount,
  };

  return { ok: true, result: { ...details, shareText: formatGirviShare(details) } };
}
