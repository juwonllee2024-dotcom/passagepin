# Example workflow

```bash
npm install
npm run build
npm run verify -- examples/verified-pin.json examples/current.txt
# EXACT
```

Change one word in `current.txt` and run the command again. The result becomes `CHANGED`. An empty file returns `MISSING`.
