import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RomanNumeralMaximumValue, RomanNumeralMinimumValue } from './consts.ts';
import { fromRomanNumeral } from './fromRomanNumeral.ts';
import { isRepresentableAsRomanNumeral } from './isRepresentableAsRomanNumeral.ts';
import { isValidRomanNumeral } from './isValidRomanNumeral.ts';
import { toRomanNumeral } from './toRomanNumeral.ts';

// ── Exported constants ──────────────────────────────────────────────────────

describe('constants', () =>
{
  it('MIN_ROMAN_VALUE is 1', () =>
  {
    assert.equal(RomanNumeralMinimumValue, 1);
  });

  it('MAX_ROMAN_VALUE is 3999', () =>
  {
    assert.equal(RomanNumeralMaximumValue, 3999);
  });
});

// ── isRepresentableAsRoman ──────────────────────────────────────────────────

describe('isRepresentableAsRoman', () =>
{
  it('returns true for values in range 1–3999', () =>
  {
    assert.equal(isRepresentableAsRomanNumeral(1), true);
    assert.equal(isRepresentableAsRomanNumeral(42), true);
    assert.equal(isRepresentableAsRomanNumeral(3999), true);
  });

  it('returns false for 0', () =>
  {
    assert.equal(isRepresentableAsRomanNumeral(0), false);
  });

  it('returns false for negative numbers', () =>
  {
    assert.equal(isRepresentableAsRomanNumeral(-1), false);
    assert.equal(isRepresentableAsRomanNumeral(-1000), false);
  });

  it('returns false for values above 3999', () =>
  {
    assert.equal(isRepresentableAsRomanNumeral(4000), false);
    assert.equal(isRepresentableAsRomanNumeral(10000), false);
    assert.equal(isRepresentableAsRomanNumeral(Number.MAX_SAFE_INTEGER), false);
  });

  it('returns false for non-integers', () =>
  {
    assert.equal(isRepresentableAsRomanNumeral(0.5), false);
    assert.equal(isRepresentableAsRomanNumeral(3.14), false);
    assert.equal(isRepresentableAsRomanNumeral(NaN), false);
    assert.equal(isRepresentableAsRomanNumeral(Infinity), false);
    assert.equal(isRepresentableAsRomanNumeral(-Infinity), false);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// isValidRoman
// ═════════════════════════════════════════════════════════════════════════════

describe('isValidRoman — accepts all canonical forms', () =>
{
  it('accepts every toRoman output for 1–3999', () =>
  {
    for (let n = 1; n <= 3999; n++)
    {
      const roman = toRomanNumeral(n);
      assert.ok(isValidRomanNumeral(roman), `isValidRoman rejected toRoman(${n}) = "${roman}"`);
    }
  });

  it('accepts single-symbol values', () =>
  {
    for (const s of ['I', 'V', 'X', 'L', 'C', 'D', 'M'])
    {
      assert.ok(isValidRomanNumeral(s), `rejected "${s}"`);
    }
  });
});

describe('isValidRoman — rejects non-canonical repetition', () =>
{
  const cases = [
    ['IIII', 'should be IV'],
    ['VIIII', 'should be IX'],
    ['XXXX', 'should be XL'],
    ['LXXXX', 'should be XC'],
    ['CCCC', 'should be CD'],
    ['DCCCC', 'should be CM'],
    ['MMMM', 'exceeds max'],
    ['VV', 'V must not repeat'],
    ['LL', 'L must not repeat'],
    ['DD', 'D must not repeat'],
  ] as const;

  for (const [input, reason] of cases)
  {
    it(`rejects "${input}" (${reason})`, () =>
    {
      assert.equal(isValidRomanNumeral(input), false);
    });
  }
});

describe('isValidRoman — rejects invalid subtractive forms', () =>
{
  const cases = [
    'IL',
    'IC',
    'ID',
    'IM',
    'VX',
    'VL',
    'VC',
    'VD',
    'VM',
    'XD',
    'XM',
    'LC',
    'LD',
    'LM',
    'DM',
  ];

  for (const input of cases)
  {
    it(`rejects "${input}"`, () =>
    {
      assert.equal(isValidRomanNumeral(input), false);
    });
  }
});

describe('isValidRoman — rejects non-canonical ordering and structure', () =>
{
  const cases = [
    ['CMCM', 'non-canonical 1800 (should be MDCCC)'],
    ['XCXC', 'non-canonical 180 (should be CLXXX)'],
    ['IXIX', 'non-canonical 18 (should be XVIII)'],
    ['IVIV', 'non-canonical 8 (should be VIII)'],
    ['CDCD', 'non-canonical 800 (should be DCCC)'],
    ['XLXL', 'non-canonical 80 (should be LXXX)'],
    ['IIV', 'doubled subtractive prefix'],
    ['IIX', 'doubled subtractive prefix'],
    ['XXL', 'doubled subtractive prefix'],
    ['XXC', 'doubled subtractive prefix'],
    ['CCD', 'doubled subtractive prefix'],
    ['CCM', 'doubled subtractive prefix'],
    ['MCMC', 'non-canonical 2100 (should be MMC)'],
    ['IXV', 'invalid: V after IX'],
    ['IXX', 'invalid: X after IX'],
    ['CMM', 'invalid: M after CM'],
    ['CDC', 'invalid: C after CD'],
    ['XLX', 'invalid: X after XL'],
    ['IVI', 'invalid: I after IV'],
  ] as const;

  for (const [input, reason] of cases)
  {
    it(`rejects "${input}" (${reason})`, () =>
    {
      assert.equal(isValidRomanNumeral(input), false);
    });
  }
});

describe('isValidRoman — rejects non-Roman input', () =>
{
  const cases = [
    ['', 'empty string'],
    [' ', 'whitespace'],
    ['  XIV  ', 'padded with spaces'],
    ['xiv', 'lowercase'],
    ['Xiv', 'mixed case'],
    ['ABC', 'non-Roman letters'],
    ['XIV2', 'contains digit'],
    ['X I V', 'contains spaces'],
    ['XIV\n', 'contains newline'],
    ['Ⅳ', 'Unicode Roman numeral character (U+2163)'],
    ['0', 'zero digit'],
    ['NULLA', 'medieval zero word'],
  ] as const;

  for (const [input, reason] of cases)
  {
    it(`rejects "${input}" (${reason})`, () =>
    {
      assert.equal(isValidRomanNumeral(input), false);
    });
  }
});

// ═════════════════════════════════════════════════════════════════════════════
// fromRoman
// ═════════════════════════════════════════════════════════════════════════════

describe('fromRoman — basic values', () =>
{
  const cases: [string, number][] = [
    ['I', 1],
    ['II', 2],
    ['III', 3],
    ['IV', 4],
    ['V', 5],
    ['VI', 6],
    ['VII', 7],
    ['VIII', 8],
    ['IX', 9],
    ['X', 10],
  ];

  for (const [input, expected] of cases)
  {
    it(`${input} → ${expected}`, () =>
    {
      assert.equal(fromRomanNumeral(input), expected);
    });
  }
});

describe('fromRoman — subtractive pairs', () =>
{
  const cases: [string, number][] = [
    ['IV', 4],
    ['IX', 9],
    ['XL', 40],
    ['XC', 90],
    ['CD', 400],
    ['CM', 900],
  ];

  for (const [input, expected] of cases)
  {
    it(`${input} → ${expected}`, () =>
    {
      assert.equal(fromRomanNumeral(input), expected);
    });
  }
});

describe('fromRoman — tricky values', () =>
{
  const cases: [string, number][] = [
    ['XLIX', 49],
    ['XCIX', 99],
    ['CDXLIV', 444],
    ['CDXCIX', 499],
    ['CMXCIX', 999],
    ['MCMXCIX', 1999],
    ['MMMDCCCLXXXVIII', 3888],
    ['MMMCMXCIX', 3999],
    ['MDCLXVI', 1666],
  ];

  for (const [input, expected] of cases)
  {
    it(`${input} → ${expected}`, () =>
    {
      assert.equal(fromRomanNumeral(input), expected);
    });
  }
});

describe('fromRoman — rejects invalid strings', () =>
{
  it('throws on empty string', () =>
  {
    assert.throws(() => fromRomanNumeral(''), /Not a valid canonical Roman numeral/);
  });

  it('throws on non-canonical IIII', () =>
  {
    assert.throws(() => fromRomanNumeral('IIII'), /Not a valid canonical Roman numeral/);
  });

  it('throws on invalid subtractive IC', () =>
  {
    assert.throws(() => fromRomanNumeral('IC'), /Not a valid canonical Roman numeral/);
  });

  it('throws on lowercase', () =>
  {
    assert.throws(() => fromRomanNumeral('xiv'), /Not a valid canonical Roman numeral/);
  });

  it('throws on non-canonical CMCM', () =>
  {
    assert.throws(() => fromRomanNumeral('CMCM'), /Not a valid canonical Roman numeral/);
  });

  it('throws on repeated subtractive pair IXIX', () =>
  {
    assert.throws(() => fromRomanNumeral('IXIX'), /Not a valid canonical Roman numeral/);
  });

  it('throws on non-Roman characters', () =>
  {
    assert.throws(() => fromRomanNumeral('ABC'), /Not a valid canonical Roman numeral/);
  });

  it('throws on VV', () =>
  {
    assert.throws(() => fromRomanNumeral('VV'), /Not a valid canonical Roman numeral/);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// toRoman — basic values 1–10
// ═════════════════════════════════════════════════════════════════════════════

describe('toRoman — basic values 1–10', () =>
{
  const cases: [number, string][] = [
    [1, 'I'],
    [2, 'II'],
    [3, 'III'],
    [4, 'IV'],
    [5, 'V'],
    [6, 'VI'],
    [7, 'VII'],
    [8, 'VIII'],
    [9, 'IX'],
    [10, 'X'],
  ];

  for (const [input, expected] of cases)
  {
    it(`${input} → ${expected}`, () =>
    {
      assert.equal(toRomanNumeral(input), expected);
    });
  }
});

// ── All six subtractive pairs ───────────────────────────────────────────────

describe('toRoman — all subtractive pairs', () =>
{
  const cases: [number, string][] = [
    [4, 'IV'],
    [9, 'IX'],
    [40, 'XL'],
    [90, 'XC'],
    [400, 'CD'],
    [900, 'CM'],
  ];

  for (const [input, expected] of cases)
  {
    it(`${input} → ${expected}`, () =>
    {
      assert.equal(toRomanNumeral(input), expected);
    });
  }
});

// ── Tricky / edge-case values ───────────────────────────────────────────────

describe('toRoman — tricky values that trip up naive implementations', () =>
{
  const cases: [number, string][] = [
    [14, 'XIV'],
    [19, 'XIX'],
    [49, 'XLIX'], // NOT IL
    [99, 'XCIX'], // NOT IC
    [399, 'CCCXCIX'],
    [444, 'CDXLIV'], // three subtractive pairs
    [499, 'CDXCIX'],
    [999, 'CMXCIX'], // NOT IM
    [1444, 'MCDXLIV'],
    [1999, 'MCMXCIX'],
    [2421, 'MMCDXXI'],
    [3888, 'MMMDCCCLXXXVIII'], // longest standard Roman numeral (15 chars)
  ];

  for (const [input, expected] of cases)
  {
    it(`${input} → ${expected}`, () =>
    {
      assert.equal(toRomanNumeral(input), expected);
    });
  }
});

// ── Notable and famous values ───────────────────────────────────────────────

describe('toRoman — notable values', () =>
{
  it('1666 → MDCLXVI (every symbol once, descending order)', () =>
  {
    assert.equal(toRomanNumeral(1666), 'MDCLXVI');
  });

  it('2026 → MMXXVI (current year)', () =>
  {
    assert.equal(toRomanNumeral(2026), 'MMXXVI');
  });

  it('1776 → MDCCLXXVI (US Declaration of Independence)', () =>
  {
    assert.equal(toRomanNumeral(1776), 'MDCCLXXVI');
  });

  it('1492 → MCDXCII (Columbus sails)', () =>
  {
    assert.equal(toRomanNumeral(1492), 'MCDXCII');
  });

  it('2000 → MM', () =>
  {
    assert.equal(toRomanNumeral(2000), 'MM');
  });

  it('1000 → M', () =>
  {
    assert.equal(toRomanNumeral(1000), 'M');
  });
});

// ── Boundary values for standard range ──────────────────────────────────────

describe('toRoman — standard range boundaries', () =>
{
  it('1 → I (minimum)', () =>
  {
    assert.equal(toRomanNumeral(1), 'I');
  });

  it('3999 → MMMCMXCIX (maximum standard Roman numeral)', () =>
  {
    assert.equal(toRomanNumeral(3999), 'MMMCMXCIX');
  });
});

// ── Out of range — throws by default ────────────────────────────────────────

describe('toRoman — out of range throws RangeError by default', () =>
{
  it('4000 throws RangeError', () =>
  {
    assert.throws(() => toRomanNumeral(4000), RangeError);
  });

  it('4001 throws RangeError', () =>
  {
    assert.throws(() => toRomanNumeral(4001), RangeError);
  });

  it('10000 throws RangeError', () =>
  {
    assert.throws(() => toRomanNumeral(10000), RangeError);
  });

  it('1000000 throws RangeError (no DoS from huge value)', () =>
  {
    assert.throws(() => toRomanNumeral(1_000_000), RangeError);
  });

  it('Number.MAX_SAFE_INTEGER throws RangeError instantly (no hang)', () =>
  {
    assert.throws(() => toRomanNumeral(Number.MAX_SAFE_INTEGER), RangeError);
  });

  it('RangeError message includes the range bounds', () =>
  {
    assert.throws(
      () => toRomanNumeral(5000),
      (err: unknown) =>
      {
        assert.ok(err instanceof RangeError);
        assert.ok(err.message.includes('1'));
        assert.ok(err.message.includes('3999'));
        return true;
      },
    );
  });
});

// ── fallbackToDecimal option ────────────────────────────────────────────────

describe('toRoman — fallbackToDecimal option', () =>
{
  it('4000 returns "4000" with fallbackToDecimal', () =>
  {
    assert.equal(toRomanNumeral(4000, { fallbackToDecimal: true }), '4000');
  });

  it('999999 returns "999999" with fallbackToDecimal', () =>
  {
    assert.equal(toRomanNumeral(999_999, { fallbackToDecimal: true }), '999999');
  });

  it('Number.MAX_SAFE_INTEGER returns its string with fallbackToDecimal', () =>
  {
    assert.equal(toRomanNumeral(Number.MAX_SAFE_INTEGER, { fallbackToDecimal: true }), String(Number.MAX_SAFE_INTEGER));
  });

  it('in-range values still return Roman numerals with fallbackToDecimal', () =>
  {
    assert.equal(toRomanNumeral(42, { fallbackToDecimal: true }), 'XLII');
    assert.equal(toRomanNumeral(3999, { fallbackToDecimal: true }), 'MMMCMXCIX');
  });

  it('invalid inputs still throw even with fallbackToDecimal', () =>
  {
    assert.throws(() => toRomanNumeral(0, { fallbackToDecimal: true }), /positive integer/);
    assert.throws(() => toRomanNumeral(-1, { fallbackToDecimal: true }), /positive integer/);
    assert.throws(() => toRomanNumeral(3.14, { fallbackToDecimal: true }), /positive integer/);
    assert.throws(() => toRomanNumeral(NaN, { fallbackToDecimal: true }), /positive integer/);
    assert.throws(() => toRomanNumeral(Infinity, { fallbackToDecimal: true }), /positive integer/);
  });
});

// ── Invalid inputs ──────────────────────────────────────────────────────────

describe('toRoman — invalid inputs throw Error (not RangeError)', () =>
{
  it('0 throws (no Roman representation of zero)', () =>
  {
    assert.throws(() => toRomanNumeral(0), /positive integer/);
  });

  it('-1 throws', () =>
  {
    assert.throws(() => toRomanNumeral(-1), /positive integer/);
  });

  it('-1000 throws', () =>
  {
    assert.throws(() => toRomanNumeral(-1000), /positive integer/);
  });

  it('0.5 throws (not an integer)', () =>
  {
    assert.throws(() => toRomanNumeral(0.5), /positive integer/);
  });

  it('3.14 throws', () =>
  {
    assert.throws(() => toRomanNumeral(3.14), /positive integer/);
  });

  it('NaN throws', () =>
  {
    assert.throws(() => toRomanNumeral(NaN), /positive integer/);
  });

  it('Infinity throws', () =>
  {
    assert.throws(() => toRomanNumeral(Infinity), /positive integer/);
  });

  it('-Infinity throws', () =>
  {
    assert.throws(() => toRomanNumeral(-Infinity), /positive integer/);
  });

  it('Number.MIN_SAFE_INTEGER throws', () =>
  {
    assert.throws(() => toRomanNumeral(Number.MIN_SAFE_INTEGER), /positive integer/);
  });

  it('invalid inputs throw plain Error, not RangeError', () =>
  {
    try
    {
      toRomanNumeral(0);
      assert.fail('should have thrown');
    }
    catch (error: unknown)
    {
      assert.ok(error instanceof Error);
      assert.ok(!(error instanceof RangeError), 'Invalid input should throw Error, not RangeError');
    }
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Exhaustive round-trip and structural validation (1–3999)
// ═════════════════════════════════════════════════════════════════════════════

describe('exhaustive validation over entire standard range (1–3999)', () =>
{
  it('round-trips: fromRoman(toRoman(n)) === n for all n in 1–3999', () =>
  {
    for (let n = 1; n <= 3999; n++)
    {
      const roman = toRomanNumeral(n);
      const roundTripped = fromRomanNumeral(roman);
      assert.equal(roundTripped, n,
        `Round-trip failed for ${n}: toRoman gave "${roman}", fromRoman gave ${roundTripped}`);
    }
  });

  it('toRoman output is always a valid canonical Roman numeral', () =>
  {
    for (let n = 1; n <= 3999; n++)
    {
      const roman = toRomanNumeral(n);
      assert.ok(isValidRomanNumeral(roman), `toRoman(${n}) = "${roman}" is not valid according to isValidRoman`);
    }
  });

  it('all outputs are unique (bijective mapping)', () =>
  {
    const seen = new Map<string, number>();
    for (let n = 1; n <= 3999; n++)
    {
      const roman = toRomanNumeral(n);
      if (seen.has(roman))
      {
        assert.fail(`Duplicate output "${roman}" for both ${seen.get(roman)} and ${n}`);
      }
      seen.set(roman, n);
    }
  });

  it('longest output is 15 characters (3888 → MMMDCCCLXXXVIII)', () =>
  {
    let maxLen = 0;
    let maxN = 0;
    for (let n = 1; n <= 3999; n++)
    {
      const len = toRomanNumeral(n).length;
      if (len > maxLen)
      {
        maxLen = len;
        maxN = n;
      }
    }
    assert.equal(maxLen, 15, `Expected max length 15, got ${maxLen} at n=${maxN}`);
    assert.equal(maxN, 3888);
    assert.equal(toRomanNumeral(3888), 'MMMDCCCLXXXVIII');
  });

  it('exactly 3999 valid canonical Roman numerals exist', () =>
  {
    let count = 0;
    const allStrings: string[] = [];

    // Generate all strings the regex could match, by iterating each place value
    const thousands = ['', 'M', 'MM', 'MMM'];
    const hundreds = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'];
    const tens = ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'];
    const ones = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

    for (const th of thousands)
    {
      for (const h of hundreds)
      {
        for (const t of tens)
        {
          for (const o of ones)
          {
            const s = th + h + t + o;
            if (s.length > 0)
            {
              allStrings.push(s);
              count++;
            }
          }
        }
      }
    }

    assert.equal(count, 3999, `Expected exactly 3999 canonical forms, got ${count}`);

    // Every generated string should be valid
    for (const s of allStrings)
    {
      assert.ok(isValidRomanNumeral(s), `Generated canonical form "${s}" rejected by isValidRoman`);
    }

    // Every generated string should round-trip through fromRoman/toRoman
    for (const s of allStrings)
    {
      const n = fromRomanNumeral(s);
      assert.equal(toRomanNumeral(n), s, `fromRoman("${s}") = ${n}, but toRoman(${n}) = "${toRomanNumeral(n)}"`);
    }
  });
});

// ── Systematic tens, hundreds, thousands ────────────────────────────────────

describe('toRoman — systematic tens', () =>
{
  const cases: [number, string][] = [
    [10, 'X'],
    [20, 'XX'],
    [30, 'XXX'],
    [40, 'XL'],
    [50, 'L'],
    [60, 'LX'],
    [70, 'LXX'],
    [80, 'LXXX'],
    [90, 'XC'],
  ];

  for (const [input, expected] of cases)
  {
    it(`${input} → ${expected}`, () =>
    {
      assert.equal(toRomanNumeral(input), expected);
    });
  }
});

describe('toRoman — systematic hundreds', () =>
{
  const cases: [number, string][] = [
    [100, 'C'],
    [200, 'CC'],
    [300, 'CCC'],
    [400, 'CD'],
    [500, 'D'],
    [600, 'DC'],
    [700, 'DCC'],
    [800, 'DCCC'],
    [900, 'CM'],
  ];

  for (const [input, expected] of cases)
  {
    it(`${input} → ${expected}`, () =>
    {
      assert.equal(toRomanNumeral(input), expected);
    });
  }
});

describe('toRoman — systematic thousands', () =>
{
  const cases: [number, string][] = [
    [1000, 'M'],
    [2000, 'MM'],
    [3000, 'MMM'],
  ];

  for (const [input, expected] of cases)
  {
    it(`${input} → ${expected}`, () =>
    {
      assert.equal(toRomanNumeral(input), expected);
    });
  }
});

// ── Composite values ────────────────────────────────────────────────────────

describe('toRoman — composite values combining all place values', () =>
{
  it('1111 → MCXI', () => assert.equal(toRomanNumeral(1111), 'MCXI'));
  it('2222 → MMCCXXII', () => assert.equal(toRomanNumeral(2222), 'MMCCXXII'));
  it('3333 → MMMCCCXXXIII', () => assert.equal(toRomanNumeral(3333), 'MMMCCCXXXIII'));
  it('1234 → MCCXXXIV', () => assert.equal(toRomanNumeral(1234), 'MCCXXXIV'));
  it('3456 → MMMCDLVI', () => assert.equal(toRomanNumeral(3456), 'MMMCDLVI'));
  it('2789 → MMDCCLXXXIX', () => assert.equal(toRomanNumeral(2789), 'MMDCCLXXXIX'));
});

// ── Numeric edge cases ──────────────────────────────────────────────────────

describe('toRoman — numeric edge cases', () =>
{
  it('integer that looks like float: 42.0 works (Number.isInteger(42.0) is true)', () =>
  {
    assert.equal(toRomanNumeral(42.0), 'XLII');
  });

  it('1e3 works (1000 in scientific notation)', () =>
  {
    assert.equal(toRomanNumeral(1e3), 'M');
  });
});
