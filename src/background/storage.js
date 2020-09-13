/* global chrome */

// Expose chrome storage API that content script can query
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request.action, 'action triggered');

  // Sign In
  if (request.action === 'set-store') {
    chrome.storage.sync.set(request.payload, () => {
      console.log('Keys stored in chrome storage', request.payload);
      sendResponse();
    });
  }

  // Sign Out
  else if (request.action === 'get-store') {
    chrome.storage.sync.get(request.payload, (items) => {
      console.log(request.payload, 'values retrieved from storage', items);
      sendResponse({ action: 'sign-in', payload: items });
    });
  }

  return true; // necessary to indicate content script to wait for async
});

chrome.storage.onChanged.addListener(() => {
  console.log('ON STORAGE CHANGE');
  chrome.storage.sync.get(null, function callback(items) {
    console.log(items);
  });
});
