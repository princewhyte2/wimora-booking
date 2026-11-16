import type { Braider } from '@/types/domain';

/** Combining diacritical marks block, left behind once NFD splits "é" into "e" + "´". */
const DIACRITICS = /[\u0300-\u036f]/g;

/** Lowercases and strips diacritics so "Chiamaka" matches "chiamaka" and "é" matches "e". */
export function normalizeSearchText(value: string): string {
  return value.normalize('NFD').replace(DIACRITICS, '').toLowerCase().trim();
}

/**
 * Filters braiders by name or specialty. Every word in the query must match,
 * so "box fatima" narrows results instead of widening them.
 */
export function searchBraiders<T extends Pick<Braider, 'name' | 'specialty'>>(
  braiders: readonly T[],
  query: string,
): T[] {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [...braiders];

  return braiders.filter((braider) => {
    const haystack = normalizeSearchText(`${braider.name} ${braider.specialty}`);
    return terms.every((term) => haystack.includes(term));
  });
}
