/* global chrome */
const url = require('url');

// Respond to requests to redirect a tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('APP', request, sender);

  // Redirect tab page
  if (request.action === 'redirect') {
    console.log('message to redirect received', request, sender);
    const redirectTo = url.resolve(
      'https://github.com',
      `${request.slug}?_pjax=%23js-repo-pjax-container`
    );

    // fetch(redirectTo, {
    //   method: 'GET'
    // })
    //   .then((response) => response.text())
    //   .then((html) => {
    //     console.log('HTML', html);
    //     // Convert the HTML string into a document object
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(html, 'text/html');
    //     sendResponse({ action: 'redirect', payload: { html: doc } });
    //   })
    //   .catch((err) => {
    //     console.error('Error fetching new page data', err);
    //   });

    chrome.tabs.update(sender.tab.id, { url: redirectTo });
    sendResponse();
  }

  // Get current tab url
  else if (request.action === 'get-current-url') {
    console.log('message to get-current-url received', request, sender);
    chrome.tabs.query(
      { active: true, lastFocusedWindow: true, currentWindow: true },
      (tabs) => {
        const parsedURL = new URL(tabs[0].url); // parsedURL.pathname = /alexkim205/tomaso
        const parsedRepoInfo = parsedURL.pathname.slice(1).split('/'); // [alexkim205, tomaso, tree?, branch?]
        const branch =
          parsedRepoInfo.length === 2 ? 'master' : parsedRepoInfo[3];
        console.log('Parsed url', parsedRepoInfo);
        sendResponse({
          action: 'get-current-url',
          payload: {
            url: tabs[0].url,
            user: parsedRepoInfo[0],
            repository: parsedRepoInfo[1],
            branch
          }
        });
      }
    );
  }

  return true; // necessary to indicate content script to wait for async
});
