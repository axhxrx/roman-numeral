# roman-numeral

```
➜  roman-numeral git:(main) ✗ deno ./mod.ts 1974
MCMLXXIV

➜  roman-numeral git:(main) ✗ bun ./main.ts 2021 # the BEST Roman numeral btw...
MMXXI

➜  roman-numeral git:(main) ✗ node ./main.ts 2077 && echo "sooo cyberpunk bro"
MMLXXVII
sooo cyberpunk bro

➜  roman-numeral git:(main) ✗ ./main.ts 5
V

➜  roman-numeral git:(main) ✗ ./main.ts 💩
Operation failed.
Error: invalidInput

➜  roman-numeral git:(main) ✗ deno
Deno 2.7.9
exit using ctrl+d, ctrl+c, or close()
REPL is running with all permissions allowed.
To specify permissions, run `deno repl` with allow flags.
> import { fromRomanNumeral } from './fromRomanNumeral.ts';
undefined
> fromRomanNumeral('MMLXXVII');
2077
> ^D
```

🤘 2026-03-31: 2.0.0 — More Roman than Roman! More Roman than Roman! Tests under Deno &  Bun & Node.

🤖 2026-03-29: repo initialized by Bottie McBotface bot@axhxrx.com
