/* global chrome */

const getCurrentTabRepositoryInfo = (callback = () => {}) =>
  chrome.runtime.sendMessage({ action: 'get-current-url' }, (response) => {
    if (response) {
      console.log('RESPONSE', response);
      callback(response.payload);
    }
  });

export default getCurrentTabRepositoryInfo;
