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
export function isValidRomanNumeral(s: string): boolean
{
  return CANONICAL_ROMAN_RE.test(s);
}
