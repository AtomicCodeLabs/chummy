import { browser } from 'webextension-polyfill-ts';

export const setInChromeStorage = (object: { [key: string]: any }) => {
  browser.runtime.sendMessage({ action: 'set-store', payload: object });
};

export const getFromChromeStorage = async (
  keys: string[],
  callback: Function
) => {
  try {
    const response = await browser.runtime.sendMessage({
      action: 'get-store',
      payload: keys
    });
    if (response?.payload) {
      callback(response.payload);
    }
  } catch (error) {
    console.warn('Error getting store', keys, error);
  }
};
