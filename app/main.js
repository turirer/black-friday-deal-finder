// A deal list: every deal and a page for each, on hash routes. The deals are in data.js, so the site needs no
// network to show them; each deal links out to its store.
//
//   #/            the list, with a search box
//   #/deal/<id>   one deal
//
// window.__shotReady is false while a page renders and true once it is on screen, so a screenshot script knows when
// to capture.

import { deals } from './data.js';
import { deal, list, missing, rows } from './views.js';

const app = document.getElementById('app');

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : 'Not found'} | Deal List`;
    app.innerHTML = found ? deal(found) : missing();
  } else {
    document.title = 'Deal List';
    app.innerHTML = list(deals);
    const search = app.querySelector('input');
    const shown = app.querySelector('.deals');
    search.addEventListener('input', () => {
      shown.innerHTML = rows(deals, search.value);
    });
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
