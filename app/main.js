// DealBeacon — a Black Friday & Cyber Monday deal finder. Every deal on the
// board was found and price-checked on Black Friday, Fri 27 Nov 2026
// (evening WIB), at the store or in a deals source that names the store.
//
// Routes (hash-based, so the site works from file:// with no server):
//   #/                              the board: search + filters + sort
//   #/?cat=Kitchen&store=Amazon     the board, pre-filtered (shareable)
//   #/deal/<id>                     one deal, with its rating evidence
//
// window.__shotReady flips true once a view is on screen, so a screenshot
// script knows when to capture.

import { deals } from "./data.js";
import { applyFilters, uniqueSorted } from "./filters.js";
import { dealDetail, filterBar, grid, howWeCheck, missing, statsBar } from "./render.js";

const app = document.getElementById("app");
const categories = uniqueSorted(deals.map((d) => d.category));
const stores = uniqueSorted(deals.map((d) => d.store));

const defaultState = () => ({ query: "", category: "All", store: "All", band: 0, sort: "score", topOnly: false });

function stateFromHash() {
  const state = defaultState();
  const params = new URLSearchParams(location.hash.split("?")[1] ?? "");
  if (params.get("q")) state.query = params.get("q");
  if (categories.includes(params.get("cat"))) state.category = params.get("cat");
  if (stores.includes(params.get("store"))) state.store = params.get("store");
  const band = Number(params.get("band"));
  if (Number.isInteger(band) && band >= 0 && band <= 4) state.band = band;
  if (params.get("sort")) state.sort = params.get("sort");
  if (params.get("top") === "1") state.topOnly = true;
  return state;
}

function board() {
  const state = stateFromHash();
  document.title = "DealBeacon — Black Friday & Cyber Monday deals, checked";
  app.innerHTML = `${statsBar()}${filterBar(state, categories, stores, 0)}<div id="results"></div>${howWeCheck()}`;

  const results = app.querySelector("#results");
  const count = app.querySelector("#result-count");
  const refresh = () => {
    const list = applyFilters(deals, state);
    results.innerHTML = grid(list);
    count.textContent = `${list.length} of ${deals.length} deals shown`;
    const clear = results.querySelector("#clear-filters");
    if (clear) clear.addEventListener("click", () => { location.hash = "#/"; });
  };
  refresh();

  app.querySelector("#q").addEventListener("input", (e) => { state.query = e.target.value; refresh(); });
  app.querySelector("#store").addEventListener("change", (e) => { state.store = e.target.value; refresh(); });
  app.querySelector("#band").addEventListener("change", (e) => { state.band = Number(e.target.value); refresh(); });
  app.querySelector("#sort").addEventListener("change", (e) => { state.sort = e.target.value; refresh(); });
  app.querySelector("#top-toggle").addEventListener("click", (e) => {
    state.topOnly = !state.topOnly;
    e.currentTarget.classList.toggle("chip-on", state.topOnly);
    e.currentTarget.setAttribute("aria-pressed", String(state.topOnly));
    refresh();
  });
  app.querySelectorAll("[data-cat]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.cat;
      app.querySelectorAll("[data-cat]").forEach((b) => b.classList.toggle("chip-on", b.dataset.cat === state.category));
      refresh();
    });
  });
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = found ? `${found.title} — ${found.store} | DealBeacon` : "Not found | DealBeacon";
    app.innerHTML = found ? dealDetail(found) : missing();
  } else {
    board();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
