// Rendering: turns deals into HTML — the card grid, the filter bar, the
// per-deal detail page, and the "how we check" explainer. All markup is
// built here; main.js only wires events and routes.

import { deals } from "./data.js";
import { DISCOUNT_BANDS, SIGNAL_CLASS, SORTS, checkedLabel, dealScore, discountPct, money } from "./filters.js";

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function statsBar() {
  const stores = new Set(deals.map((d) => d.store)).size;
  const categories = new Set(deals.map((d) => d.category)).size;
  const newLows = deals.filter((d) => d.signal === "New low").length;
  const biggest = Math.max(...deals.map(discountPct));
  return `<div class="stats">
    <div class="stat"><span class="stat-num">${deals.length}</span><span class="stat-label">checked deals</span></div>
    <div class="stat"><span class="stat-num">${stores}</span><span class="stat-label">stores</span></div>
    <div class="stat"><span class="stat-num">${categories}</span><span class="stat-label">categories</span></div>
    <div class="stat"><span class="stat-num">${newLows}</span><span class="stat-label">verified new lows</span></div>
    <div class="stat"><span class="stat-num">${biggest}%</span><span class="stat-label">deepest discount</span></div>
  </div>`;
}

export function dealCard(deal) {
  const pct = discountPct(deal);
  const score = dealScore(deal);
  return `<article class="card">
    <div class="card-top">
      <span class="badge">−${pct}%</span>
      <span class="score" title="Deal score: discount adjusted by our honest signal">Score ${score}</span>
    </div>
    <h3 class="card-title"><a href="#/deal/${deal.id}">${esc(deal.title)}</a></h3>
    <p class="card-store">${esc(deal.store)} · ${esc(deal.category)}</p>
    <p class="card-prices"><span class="price">${money(deal.price)}</span>
      <span class="was">${money(deal.was)}</span>
      <span class="saving">save ${money(deal.was - deal.price)}</span></p>
    <p class="signal ${SIGNAL_CLASS[deal.signal]}">${esc(deal.signal)}</p>
    <p class="card-note">${esc(deal.note)}</p>
    <p class="card-checked">Checked ${checkedLabel(deal.checked)} · via ${esc(deal.source)}</p>
    <div class="card-actions">
      <a class="btn btn-store" href="${esc(deal.url)}" target="_blank" rel="noopener">View at ${esc(deal.store)} →</a>
      <a class="btn btn-ghost" href="#/deal/${deal.id}">Why this rating?</a>
    </div>
  </article>`;
}

export function filterBar(state, categories, stores, count) {
  const chip = (value, current) =>
    `<button type="button" class="chip${value === current ? " chip-on" : ""}" data-cat="${esc(value)}">${esc(value)}</button>`;
  return `<section class="filters" aria-label="Search and filter deals">
    <div class="filter-row">
      <label class="search-box">
        <span class="search-icon" aria-hidden="true">⌕</span>
        <input id="q" type="search" placeholder="Search deals — try “Dyson”, “LEGO”, “OLED”…" value="${esc(state.query)}" autocomplete="off">
      </label>
      <label class="select-wrap">Store
        <select id="store">
          ${["All", ...stores].map((s) => `<option${s === state.store ? " selected" : ""}>${esc(s)}</option>`).join("")}
        </select>
      </label>
      <label class="select-wrap">Discount
        <select id="band">
          ${DISCOUNT_BANDS.map(([label], i) => `<option value="${i}"${i === state.band ? " selected" : ""}>${esc(label)}</option>`).join("")}
        </select>
      </label>
      <label class="select-wrap">Sort
        <select id="sort">
          ${SORTS.map(([value, label]) => `<option value="${value}"${value === state.sort ? " selected" : ""}>${esc(label)}</option>`).join("")}
        </select>
      </label>
      <button type="button" id="top-toggle" class="chip chip-top${state.topOnly ? " chip-on" : ""}" aria-pressed="${state.topOnly}">★ Top deals only</button>
    </div>
    <div class="chip-row" role="group" aria-label="Category">
      ${chip("All", state.category)}${categories.map((c) => chip(c, state.category)).join("")}
    </div>
    <p class="result-count" id="result-count">${count} of ${deals.length} deals shown</p>
  </section>`;
}

export function grid(list) {
  if (!list.length) {
    return `<div class="empty"><h3>No deals match those filters</h3>
      <p>Try clearing the search, or pick “All” for category and store.</p>
      <button type="button" class="btn btn-store" id="clear-filters">Clear all filters</button></div>`;
  }
  return `<div class="grid">${list.map(dealCard).join("")}</div>`;
}

export function howWeCheck() {
  return `<section class="how">
    <h2>How every deal here was checked</h2>
    <div class="how-grid">
      <div class="how-item"><h3>Read at the store, or a source that names it</h3>
        <p>Each price was read on Black Friday itself — Friday 27 November 2026, evening WIB — at the store or in a deals source that names the store. The source and check time sit on every card.</p></div>
      <div class="how-item"><h3>An honest signal, not just a percentage</h3>
        <p><strong>New low</strong> means the lowest price tracked. <strong>Strong price</strong> is a genuinely deep cut. <strong>Routine sale</strong> recurs at most big sales. <strong>Inflated MSRP</strong> warns the “was” price was padded — judge the sale price, not the headline.</p></div>
      <div class="how-item"><h3>A score you can sort by</h3>
        <p>The deal score starts from the discount and adjusts for the signal, so a verified new low outranks the same percentage on a routine sale. Prices move fast this week — confirm at checkout.</p></div>
    </div>
  </section>`;
}

export function dealDetail(deal) {
  const pct = discountPct(deal);
  const sameCategory = deals
    .filter((d) => d.category === deal.category && d.id !== deal.id)
    .sort((a, b) => dealScore(b) - dealScore(a))
    .slice(0, 3);
  return `<article class="detail">
    <p class="detail-crumb"><a href="#/">← All deals</a> · ${esc(deal.category)}</p>
    <div class="detail-head">
      <span class="badge badge-big">−${pct}%</span>
      <span class="score score-big">Deal score ${dealScore(deal)} / 100</span>
    </div>
    <h2 class="detail-title">${esc(deal.title)}</h2>
    <p class="card-store">${esc(deal.store)} · ${esc(deal.category)}</p>
    <p class="card-prices detail-prices"><span class="price">${money(deal.price)}</span>
      <span class="was">${money(deal.was)}</span>
      <span class="saving">you save ${money(deal.was - deal.price)}</span></p>
    <div class="verdict">
      <p class="signal ${SIGNAL_CLASS[deal.signal]}">${esc(deal.signal)}</p>
      <p class="verdict-note">${esc(deal.note)}</p>
    </div>
    <dl class="facts">
      <div><dt>Sale price</dt><dd>${money(deal.price)}</dd></div>
      <div><dt>Usual price</dt><dd>${money(deal.was)}</dd></div>
      <div><dt>Discount</dt><dd>${pct}% off (${money(deal.was - deal.price)} saved)</dd></div>
      <div><dt>Store</dt><dd>${esc(deal.store)}</dd></div>
      <div><dt>Price checked</dt><dd>${checkedLabel(deal.checked)}</dd></div>
      <div><dt>Where it was read</dt><dd>${esc(deal.source)}</dd></div>
    </dl>
    <p class="detail-cta"><a class="btn btn-store btn-big" href="${esc(deal.url)}" target="_blank" rel="noopener">View this deal at ${esc(deal.store)} →</a></p>
    <p class="detail-fine">Prices and stock change through Black Friday and Cyber Monday (Nov 30). Confirm the price at checkout before you pay.</p>
    ${sameCategory.length ? `<h3 class="detail-more">More ${esc(deal.category)} deals worth a look</h3><div class="grid grid-3">${sameCategory.map(dealCard).join("")}</div>` : ""}
  </article>`;
}

export function missing() {
  return `<div class="empty"><h3>That deal isn't on the board</h3>
    <p>It may have sold out or been removed. <a href="#/">Browse all checked deals →</a></p></div>`;
}
