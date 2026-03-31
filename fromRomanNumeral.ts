import { isValidRomanNumeral } from './isValidRomanNumeral.ts';

/**
 Parse a canonical Roman numeral string and return its integer value (1–3999). Throws if the string is not a valid canonical Roman numeral.

 @example
 fromRoman('XIV')   // 14
 fromRoman('MCMXCIX') // 1999
 fromRoman('IIII')  // throws Error (non-canonical)
 */
export function fromRomanNumeral(s: string): number
{
  if (!isValidRomanNumeral(s))
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
