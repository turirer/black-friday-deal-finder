// HTML for each page, built from the deal data. Every value is escaped before it goes into the page.

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${n.toLocaleString('en-US')}`;
const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);
const day = (iso) => new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';

export function rows(deals, query) {
  const q = query.trim().toLowerCase();
  const shown = deals.filter((d) => q === '' || `${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q));
  if (shown.length === 0) return '<li>No deal matches.</li>';
  return shown
    .map(
      (d) => `<li>
  <a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a>
  <span>${escape(d.store)}</span>
  <span>${usd(d.price)} <s>${usd(d.was)}</s></span>
  <span>${percentOff(d)}% off</span>
</li>`,
    )
    .join('');
}

export function list(deals) {
  return `<h1>Black Friday deals</h1>
<p><label>Search <input type="search"></label></p>
<ul class="deals">${rows(deals, '')}</ul>`;
}

export function deal(d) {
  return `<p><a href="#/">&larr; All deals</a></p>
<h1>${escape(d.title)}</h1>
<dl>
  <dt>Store</dt><dd>${escape(d.store)}</dd>
  <dt>Category</dt><dd>${escape(d.category)}</dd>
  <dt>Price</dt><dd>${usd(d.price)}, usually ${usd(d.was)} (${percentOff(d)}% off)</dd>
  <dt>Checked</dt><dd>${day(d.checked)}</dd>
  <dt>Read in</dt><dd>${escape(d.source)}</dd>
</dl>
<p><a href="${escape(d.url)}" rel="noopener">Find it at ${escape(d.store)}</a></p>`;
}

export function missing() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
