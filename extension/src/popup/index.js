import render from '../utils/render';

const EXTENSION_ID = 'popup-extension-root';

function init() {
  const extensionLoaded = document.getElementById(EXTENSION_ID);
  if (!extensionLoaded) {
    render(EXTENSION_ID);
  }
}

init();
