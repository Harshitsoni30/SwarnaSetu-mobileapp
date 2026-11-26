export type InterestMode = 'simple' | 'compound';
export type CompoundInterval = 'yearly' | 'quarterly' | 'half';

export type InterestInput = {
  amount: number;
  monthlyRate: number;
  fromDate: string;
  toDate: string;
  mode: InterestMode;
  interval: CompoundInterval;
};

export type Tenure = {
  years: number;
  months: number;
  days: number;
};

export type InterestResult = {
  months: number;
  perMonth: number;
  interest: number;
  total: number;
  tenure: Tenure;
};

export type InterestError = 'invalid_amount' | 'invalid_rate' | 'invalid_date' | 'reversed_date';

const MONTHS_IN_INTERVAL: Record<CompoundInterval, number> = {
  yearly: 12,
  quarterly: 3,
  half: 6,
};

const DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export function parseDate(value: string): number | null {
  const match = DATE_PATTERN.exec(value.trim());
  if (match === null) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const utc = Date.UTC(year, month - 1, day);
  const check = new Date(utc);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    return null;
  }
  return utc;
}

export function monthsBetween(fromUtc: number, toUtc: number): number {
  const from = new Date(fromUtc);
  const to = new Date(toUtc);
  let months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
  if (to.getUTCDate() < from.getUTCDate()) {
    months -= 1;
  }
  return Math.max(0, months);
}

export function tenureBetween(fromUtc: number, toUtc: number): Tenure {
  let cursor = fromUtc;
  let years = 0;
  let months = 0;
  while (addUtcMonths(cursor, 12) <= toUtc) {
    cursor = addUtcMonths(cursor, 12);
    years += 1;
  }
  while (addUtcMonths(cursor, 1) <= toUtc) {
    cursor = addUtcMonths(cursor, 1);
    months += 1;
  }
  return { years, months, days: Math.round((toUtc - cursor) / 86400000) };
}

export function formatTenure(tenure: Tenure): string {
  const parts = [label(tenure.years, 'year'), label(tenure.months, 'month'), label(tenure.days, 'day')].filter(
    (part): part is string => part !== null,
  );
  return parts.length === 0 ? '0 days' : parts.join(' ');
}

function label(count: number, unit: string): string | null {
  if (count === 0) {
    return null;
  }
  return `${count} ${unit}${count === 1 ? '' : 's'}`;
}

function addUtcMonths(utc: number, count: number): number {
  const date = new Date(utc);
  const day = date.getUTCDate();
  const shifted = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + count, 1));
  const lastDay = new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, 0)).getUTCDate();
  return Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), Math.min(day, lastDay));
}

export function calculateInterest(
  input: InterestInput,
): { ok: true; result: InterestResult } | { ok: false; error: InterestError } {
  if (!(input.amount > 0)) {
    return { ok: false, error: 'invalid_amount' };
  }
  if (!(input.monthlyRate >= 0) || Number.isNaN(input.monthlyRate)) {
    return { ok: false, error: 'invalid_rate' };
  }
  const from = parseDate(input.fromDate);
  const to = parseDate(input.toDate);
  if (from === null || to === null) {
    return { ok: false, error: 'invalid_date' };
  }
  if (to < from) {
    return { ok: false, error: 'reversed_date' };
  }
  const quoted = quote(input.amount, input.monthlyRate, monthsBetween(from, to), input);
  return { ok: true, result: { ...quoted, tenure: tenureBetween(from, to) } };
}

function quote(
  amount: number,
  monthlyRate: number,
  months: number,
  input: InterestInput,
): Omit<InterestResult, 'tenure'> {
  const perMonth = Math.round((amount * monthlyRate) / 100);
  const interest = Math.round(interestFor(amount, monthlyRate, months, input));
  return { months, perMonth, interest, total: amount + interest };
}

function interestFor(amount: number, monthlyRate: number, months: number, input: InterestInput): number {
  if (input.mode === 'simple' || months === 0) {
    return ((amount * monthlyRate) / 100) * months;
  }
  const monthsPerPeriod = MONTHS_IN_INTERVAL[input.interval];
  const total = amount * Math.pow(1 + (monthlyRate / 100) * monthsPerPeriod, months / monthsPerPeriod);
  return total - amount;
}
