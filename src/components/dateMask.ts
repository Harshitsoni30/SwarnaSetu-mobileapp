export function maskDate(next: string, previous: string): string {
  const digits = next.replace(/\D/g, '').slice(0, 8);
  const previousDigits = previous.replace(/\D/g, '');
  const removedSlash = digits === previousDigits && next.length < previous.length;
  const backspace = previousDigits.startsWith(digits) && digits.length < previousDigits.length;
  const holdSlash = removedSlash || backspace;
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  if (digits.length <= 2) {
    return !holdSlash && digits.length === 2 ? `${day}/` : day;
  }
  if (digits.length <= 4) {
    return !holdSlash && digits.length === 4 ? `${day}/${month}/` : `${day}/${month}`;
  }
  return `${day}/${month}/${year}`;
}
