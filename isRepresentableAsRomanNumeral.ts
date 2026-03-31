import { RomanNumeralMaximumValue, RomanNumeralMinimumValue } from './consts.ts';

/**
 Returns `true` if `n` is a positive integer within the standard Roman numeral range (1–3999).
 */
export function isRepresentableAsRomanNumeral(n: number): boolean
{
  return Number.isInteger(n) && n >= RomanNumeralMinimumValue && n <= RomanNumeralMaximumValue;
}
