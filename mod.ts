#!/usr/bin/env bun

export * from './consts.ts';
export * from './fromRomanNumeral.ts';
export * from './isRepresentableAsRomanNumeral.ts';
export * from './isValidRomanNumeral.ts';
export * from './toRomanNumeral.ts';
export * from './ToRomanNumeralOp.ts';

import { main } from './main.ts';

if (import.meta.main)
{
  main();
}
