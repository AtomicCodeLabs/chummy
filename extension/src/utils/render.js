import React from 'react';
import { render } from 'react-dom';
import loadable from '@loadable/component';

const Root = loadable(() => import('../pages/Root'), {
  fallback: <>Loading...</>
});

function renderExtension(id) {
  let app = document.getElementById(id);
  if (!app) {
    // If element doesn't exist at this point, create it and append to the body
    app = document.createElement('div');
    app.id = id;
    document.body.appendChild(app);
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Dead_object
  window.log = console.log;

  render(<Root />, app);
}

export default renderExtension;
