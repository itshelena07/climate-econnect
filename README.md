# ClimateVest

ClimateVest is a Next.js App Router prototype for submitting and assessing climate projects.

## Structure

- `app/` — Next.js routes, metadata, and global styles
- `components/` — interactive form and assessment presentation
- `lib/data.ts` — countries, policy excerpts, and GCF comparison data
- `lib/assessment.ts` — typed rule-based assessment calculation
- `lib/types.ts` — shared domain types

## Run locally

```bash
npm install
npm run dev
```

The current assessment is intentionally local and rule-based. The submission button is ready to be connected to a backend assessment endpoint when that service exists.
