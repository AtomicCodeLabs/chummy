import browser from 'webextension-polyfill';
import log from '../config/log';

// Expose chrome storage API that content script can query
const storeAccessListener = async (request) => {
  // Sign In
  if (request.action === 'set-store') {
    try {
      await browser.storage.sync.set(request.payload);
    } catch (error) {
      log.error('Error setting store', error);
    }
    return null;
  }

  // Sign Out
  if (request.action === 'get-store') {
    try {
      const items = await browser.storage.sync.get(request.payload);
      return { action: 'get-store', payload: items };
    } catch (error) {
      log.error('Error getting store', error);
      return null;
    }
  }

  return null;
};
browser.runtime.onMessage.addListener((request) => {
  if (['set-store', 'get-store'].includes(request.action)) {
    return storeAccessListener(request);
  }
});

// For debugging purposes
browser.storage.onChanged.addListener(async () => {
  try {
    const items = await browser.storage.sync.get(null);
    log.debug('DEBUG', items);
  } catch (error) {
    log.error('Error getting store changes for debugging', error);
  }
});
