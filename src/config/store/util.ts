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
      console.log('get-store message received', response);
      callback(response.payload);
    }
  } catch (error) {
    console.error('Error getting store', keys, error);
  }
};
