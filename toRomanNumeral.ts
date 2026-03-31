import { RomanNumeralMaximumValue, RomanNumeralMinimumValue } from './consts.ts';
import { isRepresentableAsRomanNumeral } from './isRepresentableAsRomanNumeral.ts';

/**
 Convert a positive integer to a Roman numeral string. Supports the standard range of 1–3999.

 Throws if the value is not a positive integer. Throws if the value is outside the range 1–3999, unless `options.fallbackToDecimal` is `true`, in which case out-of-range positive integers are returned as their `String(n)` representation (which may use scientific notation for very large numbers).

 @example
 toRoman(1) // 'I'
 toRoman(4) // 'IV'
 toRoman(2026) // 'MMXXVI'
 toRoman(3999) // 'MMMCMXCIX'
 toRoman(4000) // throws RangeError
 toRoman(4000, { fallbackToDecimal: true }) // '4000'
 */
export function toRomanNumeral(n: number, options?: ToRomanNumeralOptions): string
{
  if (!Number.isInteger(n) || n <= 0)
  {
    throw new Error(`toRoman requires a positive integer, got ${n}`);
  }

  if (!isRepresentableAsRomanNumeral(n))
  {
    if (options?.fallbackToDecimal)
    {
      return String(n);
    }
    throw new RangeError(
      `${n} is outside the representable Roman numeral range (${RomanNumeralMinimumValue}–${RomanNumeralMaximumValue})`,
    );
  }

  const thousands = Math.floor(n / 1000);
  const remainder = n % 1000;

  return 'M'.repeat(thousands) + toRomanCore(remainder);
}

/**
 Options for the `toRomanNumeral()` function.
 */
export interface ToRomanNumeralOptions
{
  /**
   If `true`, values outside the representable range (1–3999) that are still positive integers will be returned as their `String(n)` representation instead of throwing. Note that for very large numbers this may use scientific notation (e.g. `"1e+21"`). Non-integers, NaN, negative numbers, etc. still throw.
   */
  fallbackToDecimal?: boolean;
}

const ROMAN_VALUES: [number, string][] = [
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

function toRomanCore(n: number): string
{
  let result = '';
  let remaining = n;
  for (const [value, numeral] of ROMAN_VALUES)
  {
    while (remaining >= value)
    {
      result += numeral;
      remaining -= value;
    }
  }
  return result;
}
