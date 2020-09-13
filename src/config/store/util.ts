/* global chrome */

export const setInChromeStorage = (object: { [key: string]: any }) => {
  chrome.runtime.sendMessage(
    { action: 'set-store', payload: object },
    (response) => {
      if (response) {
        console.log('set-store message received', response);
      } else {
        console.error('Error setting store', object);
      }
    }
  );
};

export const getFromChromeStorage = (keys: string[], callback: Function) => {
  chrome.runtime.sendMessage(
    { action: 'get-store', payload: keys },
    (response) => {
      if (response.payload) {
        console.log('get-store message received', response);
        callback(response.payload);
      } else {
        console.error('Error getting store', keys);
      }
    }
  );
};
