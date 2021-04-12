import render from '../utils/render';

const EXTENSION_ID = 'content-extension-root';

function init() {
  const extensionLoaded = document.getElementById(EXTENSION_ID);
  if (!extensionLoaded) {
    render(EXTENSION_ID);
  }
}

init();
