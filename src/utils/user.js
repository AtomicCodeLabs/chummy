import browser from 'webextension-polyfill';

export const getAllBookmarks = async () => {
  try {
    const response = await browser.runtime.sendMessage({
      action: 'get-bookmarks'
    });
    if (response) {
      return response;
    }
  } catch (error) {
    console.error('Error getting all bookmarks', error);
  }
  return null;
};

export const addBookmark = async (bookmark) => {
  await browser.runtime.sendMessage({
    action: 'create-bookmark',
    payload: bookmark
  });
};

export const updateBookmark = async (bookmark) => {
  await browser.runtime.sendMessage({
    action: 'update-bookmark',
    payload: bookmark
  });
};

export const removeBookmark = async (bookmark) => {
  await browser.runtime.sendMessage({
    action: 'remove-bookmark',
    payload: bookmark
  });
};

export default {
  getAllBookmarks,
  addBookmark,
  updateBookmark,
  removeBookmark
};
