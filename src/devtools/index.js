/* global chrome */

function createPanel() {
  chrome.devtools.panels.create('Tomaso', null, 'devpanel.html', null);
}

if (chrome.runtime.getBackgroundPage) {
  // Check if the background page's object is accessible (not in incognito)
  chrome.runtime.getBackgroundPage((background) => {
    createPanel(background ? 'window.html' : 'devpanel.html');
  });
} else {
  createPanel('devpanel.html');
}
