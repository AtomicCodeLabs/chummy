import browser from 'webextension-polyfill';

console.log('INJECT SIGNIN');

/*
Listen for messages from the page.
If the message was from the page script, show an alert.
*/
function authListener() {
  window.addEventListener('message', (event) => {
    if (event.source === window && event.data?.action === 'auth-from-page') {
      console.log(`Content script received message`, event.data);

      const response = {
        action: 'auth-from-content-script',
        payload: event.data.payload
      };
      console.log('Now sending auth message back to extension', response);
      browser.runtime.sendMessage(response);
    }
  });
}

// Initialize listener right away
authListener();

// Send message after page has loaded

// Send message to emit auth to content script on script injection
window.postMessage({ action: 'trigger-send-to-cs' }, '*');
