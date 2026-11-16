/** URL search params can repeat (`?a=1&a=2`); screens only ever want the first value. */
export function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
