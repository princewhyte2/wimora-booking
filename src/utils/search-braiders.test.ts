import { BRAIDERS } from '@/data/braiders';
import { normalizeSearchText, searchBraiders } from '@/utils/search-braiders';

const names = (query: string) => searchBraiders(BRAIDERS, query).map((braider) => braider.name);

describe('searchBraiders', () => {
  it('returns every braider for an empty or whitespace query', () => {
    expect(names('')).toHaveLength(BRAIDERS.length);
    expect(names('   ')).toHaveLength(BRAIDERS.length);
  });

  it('matches by name, case-insensitively', () => {
    expect(names('fatima')).toEqual(['Fatima Diallo']);
    expect(names('OKAFOR')).toEqual(['Adaeze Okafor']);
  });

  it('matches by specialty', () => {
    expect(names('twists')).toEqual(['Aminata Sow']);
    expect(names('braids')).toEqual(['Adaeze Okafor', 'Fatima Diallo']);
  });

  it('requires every term to match', () => {
    expect(names('box fatima')).toEqual(['Fatima Diallo']);
    expect(names('box adaeze')).toEqual([]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(names('locs')).toEqual([]);
  });

  it('ignores diacritics', () => {
    expect(names('fátima')).toEqual(['Fatima Diallo']);
  });
});

describe('normalizeSearchText', () => {
  it('trims, lowercases and strips accents', () => {
    expect(normalizeSearchText('  Crème  ')).toBe('creme');
  });
});
