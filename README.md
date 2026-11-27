# DealBeacon — Black Friday & Cyber Monday deals, checked

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/turirer/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/turirer/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

DealBeacon is a Black Friday and Cyber Monday deal finder: 69 real deals
across 9 stores and 12 categories — audio, laptops, TVs, phones, wearables,
gaming, smart home, kitchen, cleaning, fitness & beauty, fashion and toys.

Every price was checked on Black Friday itself, Friday 27 November 2026
(evening WIB), at the named store or in a deals source that names the store,
and each card says when it was checked and where it was read. On top of the
discount, every deal carries an honest signal — **New low** (the lowest
price tracked), **Strong price**, **Routine sale**, or **Inflated MSRP**
(the “was” price was padded; judge the sale price, not the headline) — with
the evidence in one line. A deal score (discount adjusted by the signal)
lets you sort the genuine bargains first.

What you can do:

- **Search** by product, store or category, and **filter** by category
  chips, store, and discount band (20% / 40% / 50% / 60% off or more).
- **Sort** by deal score, biggest discount, lowest or highest price, or
  biggest dollar saving; or flip on **Top deals only** (score 60+).
- Open any deal for its full page: sale and usual price, the saving, the
  signal's evidence, when and where the price was read, and a button
  straight to the product at its store.
- Filtered views are shareable: `#/?cat=Kitchen&store=Amazon` opens the
  board pre-filtered.

The site is plain static files under `app/` — no build step, no libraries,
no network requests, works offline from `app/index.html` on desktop and
phone. Source is split by job: `data.js` (the checked deals), `filters.js`
(search, filter, sort, score), `render.js` (markup), `main.js` (routing
and wiring), `style.css`.

Run it locally with `node serve.ts`, then open http://localhost:8080.
Hand it in with `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.

Entry for the make.fun bounty: https://make.fun/bounty/black-friday-deal-finder-01

Referral: https://make.fun/r/d6btpjsv
