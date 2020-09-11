/* global chrome */

// eslint-disable-next-line import/prefer-default-export
export const inActiveTab = (callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    callback(tabs);
  });
};
