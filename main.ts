#!/usr/bin/env bun

import process from 'node:process';
import { parseArgs } from 'node:util';

import { init } from '@axhxrx/op';

import { ToRomanNumeralOp } from './ToRomanNumeralOp.ts';

export const RomanNumeralCliUsage = `Usage: roman-numeral [--fallback-to-decimal] <number>

Converts a positive integer (1-3999) to a Roman numeral string.

Options:
  -h, --help                  Show this help text
  --fallback-to-decimal       Return decimal text for out-of-range positive integers

Examples:
  bun mod.ts 42
  bun mod.ts --fallback-to-decimal 4000
  deno run -A mod.ts 2026`;

export type ParseRomanNumeralCliArgsResult =
  | {
    ok: true;
    fallbackToDecimal: boolean;
    showHelp: true;
  }
  | {
    ok: true;
    fallbackToDecimal: boolean;
    showHelp: false;
    value: number;
  }
  | {
    ok: false;
    error: string;
  };

export function parseRomanNumeralCliArgs(args: string[]): ParseRomanNumeralCliArgsResult
{
  try
  {
    const parsed = parseArgs({
      args,
      allowPositionals: true,
      options: {
        help: {
          type: 'boolean',
          short: 'h',
        },
        'fallback-to-decimal': {
          type: 'boolean',
        },
      },
      strict: true,
    });

    const fallbackToDecimal = Boolean(parsed.values['fallback-to-decimal']);

    if (parsed.values.help)
    {
      return {
        ok: true,
        fallbackToDecimal,
        showHelp: true,
      };
    }

    if (parsed.positionals.length !== 1)
    {
      return {
        ok: false,
        error: `Expected exactly 1 positional argument, but got ${parsed.positionals.length}.`,
      };
    }

    return {
      ok: true,
      fallbackToDecimal,
      showHelp: false,
      value: Number(parsed.positionals[0]),
    };
  }
  catch (error: unknown)
  {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function main(rawArgs: string[] = process.argv.slice(2))
{
  const { args, opsMain } = init(rawArgs);
  const parsedArgs = parseRomanNumeralCliArgs(args);

  if (!parsedArgs.ok)
  {
    console.error(parsedArgs.error);
    console.error('');
    console.error(RomanNumeralCliUsage);
    process.exitCode = 1;
    return;
  }

  if (parsedArgs.showHelp)
  {
    console.log(RomanNumeralCliUsage);
    return;
  }

  const outcome = await opsMain(new ToRomanNumeralOp({
    value: parsedArgs.value,
    fallbackToDecimal: parsedArgs.fallbackToDecimal,
  }));

  if (outcome.ok)
  {
    console.log(outcome.value);
  }
  else
  {
    console.warn('Operation failed.');
    console.error(`Error: ${outcome.failure}`);
  }
}

if (import.meta.main)
{
  main();
}
