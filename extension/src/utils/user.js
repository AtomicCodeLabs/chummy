import browser from 'webextension-polyfill';

export const onSignInComplete = (callback = () => {}) => {
  const toCall = (request) => {
    if (request.action === 'sign-in-complete') {
      callback(request.payload);
    }
  };
  browser.runtime.onMessage.addListener(toCall);
};

export const getAllBookmarks = async () => {
  try {
    const request = {
      action: 'get-bookmarks'
    };
    console.log(
      '%cGet bookmarks request -> bg',
      'background-color: #00c853; color: white;',
      request
    );
    const response = await browser.runtime.sendMessage(request);
    console.log('Response', response);

    if (response) {
      return response;
    }
  } catch (error) {
    console.warn('Error getting all bookmarks', error);
  }
  return null;
};

export const addBookmark = async (bookmark) => {
  const request = {
    action: 'create-bookmark',
    payload: bookmark
  };
  console.log(
    '%cCreate bookmark request -> bg',
    'background-color: #00c853; color: white;',
    request
  );
  await browser.runtime.sendMessage(request);
};

export const updateBookmark = async (bookmark) => {
  const request = {
    action: 'update-bookmark',
    payload: bookmark
  };
  console.log(
    '%cUpdate bookmark request -> bg',
    'background-color: #00c853; color: white;',
    request
  );
  await browser.runtime.sendMessage(request);
};

export const removeBookmark = async (bookmark) => {
  const request = {
    action: 'remove-bookmark',
    payload: bookmark
  };
  console.log(
    '%cRemove bookmark request -> bg',
    'background-color: #00c853; color: white;',
    request
  );
  await browser.runtime.sendMessage(request);
};

export default {
  getAllBookmarks,
  addBookmark,
  updateBookmark,
  removeBookmark,
  onSignInComplete
};
