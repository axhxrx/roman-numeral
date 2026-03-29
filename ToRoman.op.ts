#!/usr/bin/env bun

/**
 @fileoverview Op that converts a positive integer to a Roman numeral string.

 Supports values from 1 to 3999 using standard subtractive notation. Values outside this range throw by default, or return decimal notation if the `fallbackToDecimal` option is set.

 Usage:
 ```bash
 bun ToRoman.op.ts <number>
 bun ToRoman.op.ts 2026        # → MMXXVI
 bun ToRoman.op.ts 3999        # → MMMCMXCIX
 ```
 */
import process from 'node:process';

import { Op } from '@axhxrx/op';
import type { Failure, Success } from '@axhxrx/op';

// ── Public constants ─────────────────────────────────────────────────────

/**
 The minimum value representable as a standard Roman numeral.
 */
export const MIN_ROMAN_VALUE = 1;

/**
 The maximum value representable as a standard Roman numeral.
 */
export const MAX_ROMAN_VALUE = 3999;

// ── Public utilities ─────────────────────────────────────────────────────

/**
 Returns `true` if `n` is a positive integer within the standard Roman numeral range (1–3999).
 */
export function isRepresentableAsRoman(n: number): boolean
{
  return Number.isInteger(n) && n >= MIN_ROMAN_VALUE && n <= MAX_ROMAN_VALUE;
}

/**
 Regex that matches exactly the set of canonical Roman numeral strings (I through MMMCMXCIX). The `(?=.)` lookahead prevents matching the empty string.

 Breakdown:
 - `M{0,3}` — thousands: 0–3 M's
 - `(CM|CD|D?C{0,3})` — hundreds: CM (900), CD (400), D + 0–3 C's (500–800), or 0–3 C's (0–300)
 - `(XC|XL|L?X{0,3})` — tens: XC (90), XL (40), L + 0–3 X's (50–80), or 0–3 X's (0–30)
 - `(IX|IV|V?I{0,3})` — ones: IX (9), IV (4), V + 0–3 I's (5–8), or 0–3 I's (0–3)
 */
const CANONICAL_ROMAN_RE = /^(?=.)M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

/**
 Returns `true` if `s` is a valid canonical Roman numeral string in standard subtractive notation. Only uppercase strings in the range I–MMMCMXCIX (1–3999) are accepted.

 @example
 isValidRoman('XIV')    // true
 isValidRoman('IIII')   // false (non-canonical; should be IV)
 isValidRoman('IC')     // false (invalid subtractive form)
 isValidRoman('viii')   // false (lowercase)
 isValidRoman('')       // false
 */
export function isValidRoman(s: string): boolean
{
  return CANONICAL_ROMAN_RE.test(s);
}

/**
 Parse a canonical Roman numeral string and return its integer value (1–3999). Throws if the string is not a valid canonical Roman numeral.

 @example
 fromRoman('XIV')   // 14
 fromRoman('MCMXCIX') // 1999
 fromRoman('IIII')  // throws Error (non-canonical)
 */
export function fromRoman(s: string): number
{
  if (!isValidRoman(s))
  {
    throw new Error(`Not a valid canonical Roman numeral: "${s}"`);
  }

  const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++)
  {
    const ch = s[i]!; // TS for-loop i known issue
    const current = values[ch]!; // TS for-loop i known issue
    const next = values[s[i + 1] ?? ''] ?? 0;
    if (current < next)
    {
      total -= current;
    }
    else
    {
      total += current;
    }
  }
  return total;
}

// ── Options ──────────────────────────────────────────────────────────────

/**
 Options for the `toRoman` function.
 */
export interface ToRomanFunctionOptions
{
  /**
   If `true`, values outside the representable range (1–3999) that are still positive integers will be returned as their `String(n)` representation instead of throwing. Note that for very large numbers this may use scientific notation (e.g. `"1e+21"`). Non-integers, NaN, negative numbers, etc. still throw.
   */
  fallbackToDecimal?: boolean;
}

/**
 Options for the ToRoman Op.
 */
export interface ToRomanOptions
{
  /**
   The positive integer to convert to a Roman numeral string.
   */
  value: number;

  /**
   If `true`, values outside the representable range (1–3999) that are still positive integers will be returned as their `String(n)` representation instead of failing. Note that for very large numbers this may use scientific notation (e.g. `"1e+21"`). Non-integers, NaN, negative numbers, etc. still fail.
   */
  fallbackToDecimal?: boolean;
}

type ToRomanFailure = 'invalidInput' | 'outOfRange';

/**
 Op that converts a positive integer to its Roman numeral representation.

 Returns the Roman numeral string on success, or a failure if the input is not a positive integer or is out of range (unless `fallbackToDecimal` is set).
 */
export class ToRoman extends Op
{
  name = 'ToRoman';

  constructor(private options: ToRomanOptions)
  {
    super();
  }

  async run(): Promise<Success<string> | Failure<ToRomanFailure>>
  {
    const { value, fallbackToDecimal } = this.options;

    if (!Number.isInteger(value) || value <= 0)
    {
      return this.fail('invalidInput' as const, `toRoman requires a positive integer, got ${value}`);
    }

    if (!isRepresentableAsRoman(value))
    {
      if (fallbackToDecimal)
      {
        return this.succeed(String(value));
      }
      return this.fail('outOfRange' as const,
        `${value} is outside the representable Roman numeral range (${MIN_ROMAN_VALUE}–${MAX_ROMAN_VALUE})`);
    }

    // Upstream lib requires run() to be async, although we have no need for it here, so do a no-op await.
    await Promise.resolve();

    return this.succeed(toRoman(value));
  }
}

// ── Public API ────────────────────────────────────────────────────────────

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
export function toRoman(n: number, options?: ToRomanFunctionOptions): string
{
  if (!Number.isInteger(n) || n <= 0)
  {
    throw new Error(`toRoman requires a positive integer, got ${n}`);
  }

  if (!isRepresentableAsRoman(n))
  {
    if (options?.fallbackToDecimal)
    {
      return String(n);
    }
    throw new RangeError(
      `${n} is outside the representable Roman numeral range (${MIN_ROMAN_VALUE}–${MAX_ROMAN_VALUE})`,
    );
  }

  const thousands = Math.floor(n / 1000);
  const remainder = n % 1000;

  return 'M'.repeat(thousands) + toRomanCore(remainder);
}

// ── Internal helpers ──────────────────────────────────────────────────────

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

// ── CLI ──────────────────────────────────────────────────────────────────

if (import.meta.main)
{
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h')
  {
    console.log(`Usage: bun ToRoman.op.ts <number>

Converts a positive integer (1–3999) to a Roman numeral string.

Examples:
  bun ToRoman.op.ts 42          # → XLII
  bun ToRoman.op.ts 2026        # → MMXXVI
  bun ToRoman.op.ts 3999        # → MMMCMXCIX`);
    process.exit(args.length === 0 ? 1 : 0);
  }

  const input = Number(args[0]);

  const op = new ToRoman({ value: input });
  const result = await op.run();

  if (result.ok)
  {
    process.stdout.write(result.value + '\n');
  }
  else
  {
    console.error(`Error: ${result.failure}`);
    if (result.debugData)
    {
      console.error(result.debugData);
    }
    process.exit(1);
  }
}
