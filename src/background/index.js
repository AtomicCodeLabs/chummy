/* global chrome */
console.log('background-outside');

// Rules set when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('background');
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'github.com' }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

// Called when the user clicks on the browser action
chrome.browserAction.onClicked.addListener(() => {
  console.log('clicked');
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: 'clicked_browser_action'
    });
  });
});
