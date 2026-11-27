// Filtering, sorting and scoring: the logic that turns the full deal list
// into the shortlist on screen. Pure functions over the deals in data.js,
// plus the formatters every view shares.

export const discountPct = (deal) => Math.round((1 - deal.price / deal.was) * 100);

export const money = (n) =>
  n % 1 === 0 ? `$${n.toLocaleString("en-US")}` : `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// A 0–100 deal score: the discount is the base, and the honest signal moves
// it — a verified new low counts for more than the same percentage on a
// routine sale, and an inflated list price counts for less.
const SIGNAL_BONUS = { "New low": 18, "Strong price": 8, "Routine sale": 0, "Inflated MSRP": -14 };

export const dealScore = (deal) =>
  Math.max(0, Math.min(100, discountPct(deal) + (SIGNAL_BONUS[deal.signal] ?? 0)));

export const SIGNAL_CLASS = {
  "New low": "signal-new-low",
  "Strong price": "signal-strong",
  "Routine sale": "signal-routine",
  "Inflated MSRP": "signal-inflated",
};

// Discount bands for the filter menu: [label, test].
export const DISCOUNT_BANDS = [
  ["Any discount", () => true],
  ["20% off or more", (pct) => pct >= 20],
  ["40% off or more", (pct) => pct >= 40],
  ["50% off or more", (pct) => pct >= 50],
  ["60% off or more", (pct) => pct >= 60],
];

export const SORTS = [
  ["score", "Best deal score"],
  ["discount", "Biggest discount"],
  ["price-asc", "Lowest price"],
  ["price-desc", "Highest price"],
  ["saving", "Biggest $ saving"],
];

export function applyFilters(deals, state) {
  const query = state.query.trim().toLowerCase();
  const band = DISCOUNT_BANDS[state.band]?.[1] ?? (() => true);
  const out = deals.filter((deal) => {
    if (state.category !== "All" && deal.category !== state.category) return false;
    if (state.store !== "All" && deal.store !== state.store) return false;
    if (!band(discountPct(deal))) return false;
    if (state.topOnly && dealScore(deal) < 60) return false;
    if (query) {
      const haystack = `${deal.title} ${deal.store} ${deal.category} ${deal.signal}`.toLowerCase();
      if (!query.split(/\s+/).every((word) => haystack.includes(word))) return false;
    }
    return true;
  });
  const by = {
    score: (a, b) => dealScore(b) - dealScore(a) || discountPct(b) - discountPct(a),
    discount: (a, b) => discountPct(b) - discountPct(a) || a.price - b.price,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    saving: (a, b) => b.was - b.price - (a.was - a.price),
  }[state.sort] ?? (() => 0);
  return out.sort(by);
}

export const uniqueSorted = (values) => [...new Set(values)].sort();

// "Fri 27 Nov 2026, 19:20 WIB" from an ISO UTC timestamp, in the reader's
// Western Indonesia Time (UTC+7), the timezone the prices were checked in.
export function checkedLabel(iso) {
  const d = new Date(new Date(iso).getTime() + 7 * 3600 * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${days[d.getUTCDay()]} ${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${hh}:${mm} WIB`;
}
