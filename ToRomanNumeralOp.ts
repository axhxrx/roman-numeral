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
import { RomanNumeralMaximumValue, RomanNumeralMinimumValue } from './consts.ts';
import { isRepresentableAsRomanNumeral } from './isRepresentableAsRomanNumeral.ts';
import { toRomanNumeral } from './toRomanNumeral.ts';

// ── Options ──────────────────────────────────────────────────────────────

/**
 Options for the ToRoman Op.
 */
export interface ToRomanNumeralOpInput
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

type RomanNumeralConversionFailure = 'invalidInput' | 'outOfRange';

/**
 Op that converts a positive integer to its Roman numeral representation.

 Returns the Roman numeral string on success, or a failure if the input is not a positive integer or is out of range (unless `fallbackToDecimal` is set).
 */
export class ToRomanNumeralOp extends Op<
  string,
  RomanNumeralConversionFailure
>
{
  name = 'ToRomanNumeralOp';

  private options: ToRomanNumeralOpInput;

  constructor(options: ToRomanNumeralOpInput)
  {
    super();
    this.options = options;
  }

  async execute(): Promise<Success<string> | Failure<RomanNumeralConversionFailure>>
  {
    const { value, fallbackToDecimal } = this.options;

    if (!Number.isInteger(value) || value <= 0)
    {
      return this.fail('invalidInput' as const, `toRoman requires a positive integer, got ${value}`);
    }

    if (!isRepresentableAsRomanNumeral(value))
    {
      if (fallbackToDecimal)
      {
        return this.succeed(String(value));
      }
      return this.fail(
        'outOfRange' as const,
        `${value} is outside the representable Roman numeral range (${RomanNumeralMinimumValue}–${RomanNumeralMaximumValue})`,
      );
    }

    await Promise.resolve();

    return this.succeed(toRomanNumeral(value));
  }
}

export async function main(args: string[] = process.argv.slice(2))
{
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

  const op = new ToRomanNumeralOp({ value: input });
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

if (import.meta.main)
{
  main();
}
