import browser from 'webextension-polyfill';

export const onActiveTabChange = (callback = () => {}) => {
  const toCall = (request) => {
    if (request.action === 'active-tab-changed') {
      callback(request.payload);
    }
  };
  browser.runtime.onMessage.addListener(toCall);

  return () => browser.runtime.onMessage.removeListener(toCall);
};

export const FILLER = 0;
