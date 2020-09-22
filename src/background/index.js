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

// Called when the user clicks on the extension icon
chrome.pageAction.onClicked.addListener(() => {
  console.log('clicked');
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: 'clicked_page_action'
    });
  });
});

const displayPageAction = (tabId, changeInfo, tab) => {
  const regex = new RegExp(/^(http|https):\/\/github\.com(\/[^/]+){2,}$/);
  const match = regex.exec(tab.url);

  // We only display the Page Action if we are inside a tab that matches
  if (changeInfo.status === 'complete') {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!match) {
      console.log('showing page action');
      chrome.pageAction.setIcon({ tabId, path: 'icon/up16.png' });
      // Inject content script
      chrome.tabs.executeScript({
        file: 'content-script.js'
      });
    } else {
      console.log('hiding page action');
      chrome.pageAction.setIcon({ tabId, path: 'icon/down16.png' });
    }
  }
};

chrome.tabs.onUpdated.addListener(displayPageAction);
