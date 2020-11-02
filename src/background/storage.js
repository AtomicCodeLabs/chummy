import browser from 'webextension-polyfill';

// Expose chrome storage API that content script can query
const storeAccessListener = async (request) => {
  // Sign In
  if (request.action === 'set-store') {
    try {
      await browser.storage.sync.set(request.payload);
    } catch (error) {
      console.error('Error setting store', error);
    }
    return null;
  }

  // Sign Out
  if (request.action === 'get-store') {
    try {
      const items = await browser.storage.sync.get(request.payload);
      return { action: 'get-store', payload: items };
    } catch (error) {
      console.error('Error getting store', error);
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
    console.log('DEBUG', items);
  } catch (error) {
    console.error('Error getting store changes for debugging', error);
  }
});
