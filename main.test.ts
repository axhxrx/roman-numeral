import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseRomanNumeralCliArgs } from './main.ts';

describe('parseRomanNumeralCliArgs', () =>
{
  it('parses a positional number with no flags', () =>
  {
    assert.deepEqual(parseRomanNumeralCliArgs(['42']), {
      ok: true,
      fallbackToDecimal: false,
      showHelp: false,
      value: 42,
    });
  });

  it('parses --fallback-to-decimal before the positional number', () =>
  {
    assert.deepEqual(parseRomanNumeralCliArgs(['--fallback-to-decimal', '4000']), {
      ok: true,
      fallbackToDecimal: true,
      showHelp: false,
      value: 4000,
    });
  });

  it('parses --fallback-to-decimal after the positional number', () =>
  {
    assert.deepEqual(parseRomanNumeralCliArgs(['4000', '--fallback-to-decimal']), {
      ok: true,
      fallbackToDecimal: true,
      showHelp: false,
      value: 4000,
    });
  });

  it('parses --help without requiring a positional number', () =>
  {
    assert.deepEqual(parseRomanNumeralCliArgs(['--help']), {
      ok: true,
      fallbackToDecimal: false,
      showHelp: true,
    });
  });

  it('parses -h without requiring a positional number', () =>
  {
    assert.deepEqual(parseRomanNumeralCliArgs(['-h']), {
      ok: true,
      fallbackToDecimal: false,
      showHelp: true,
    });
  });

  it('rejects missing positional arguments', () =>
  {
    assert.deepEqual(parseRomanNumeralCliArgs([]), {
      ok: false,
      error: 'Expected exactly 1 positional argument, but got 0.',
    });
  });

  it('rejects extra positional arguments', () =>
  {
    assert.deepEqual(parseRomanNumeralCliArgs(['1', '2']), {
      ok: false,
      error: 'Expected exactly 1 positional argument, but got 2.',
    });
  });

  it('rejects unknown options', () =>
  {
    const result = parseRomanNumeralCliArgs(['--wat']);
    assert.equal(result.ok, false);

    if (result.ok)
    {
      assert.fail('Expected parsing to fail');
    }

    assert.match(result.error, /Unknown option '--wat'/);
  });
});
