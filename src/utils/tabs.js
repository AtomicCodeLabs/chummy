/* global chrome */

export const onActiveTabChange = (callback = () => {}) => {
  const toCall = (request) => {
    if (request.action === 'active-tab-changed') {
      callback(request.payload);
    }
  };
  chrome.runtime.onMessage.addListener(toCall);

  return () => chrome.runtime.onMessage.removeListener(toCall);
};

export const FILLER = 0;
