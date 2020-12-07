import { browser } from 'webextension-polyfill-ts';

export const setInChromeStorage = (object: { [key: string]: any }) => {
  browser.runtime.sendMessage({ action: 'set-store', payload: object });
};

export const getFromChromeStorage = async (
  keys: string[],
  callback: Function
) => {
  try {
    const request = {
      action: 'get-store',
      payload: keys
    };
    console.log(
      '%cGet store request -> bg',
      'background-color: #00c853; color: white;',
      request
    );
    const response = await browser.runtime.sendMessage(request);
    console.log('Response', response);
    if (response?.payload) {
      callback(response.payload);
    }
  } catch (error) {
    console.warn('Error getting store', keys, error);
  }
};
