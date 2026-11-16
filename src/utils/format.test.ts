import { formatDuration, formatPrice, formatRating, getInitials } from '@/utils/format';

describe('formatDuration', () => {
  it.each([
    [45, '45 min'],
    [60, '1 hr'],
    [90, '1 hr 30 min'],
    [240, '4 hr'],
    [210, '3 hr 30 min'],
  ])('formats %i minutes as "%s"', (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected);
  });
});

describe('formatPrice', () => {
  it('formats whole dollars without cents', () => {
    expect(formatPrice(180)).toBe('$180');
  });
});

describe('formatRating', () => {
  it('always shows one decimal place', () => {
    expect(formatRating(5)).toBe('5.0');
    expect(formatRating(4.8)).toBe('4.8');
  });
});

describe('getInitials', () => {
  it('uses the first letter of the first two names', () => {
    expect(getInitials('Adaeze Okafor')).toBe('AO');
    expect(getInitials('  cher ')).toBe('C');
  });
});
