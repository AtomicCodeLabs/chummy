import browser from 'webextension-polyfill';
import log from '../config/log';

export const onSignInComplete = (callback = () => {}) => {
  const toCall = (request) => {
    if (request.action === 'sign-in-complete') {
      callback(request);
    }
  };
  browser.runtime.onMessage.addListener(toCall);
};

export const getAllBookmarks = async () => {
  try {
    const request = {
      action: 'get-bookmarks'
    };
    log.toBg('Get bookmarks request -> bg', request);
    const response = await browser.runtime.sendMessage(request);
    log.debug('Response', response);

    if (response) {
      return response;
    }
  } catch (error) {
    log.error('Error getting all bookmarks', error);
  }
  return null;
};

export const addBookmark = async (bookmark) => {
  const request = {
    action: 'create-bookmark',
    payload: bookmark
  };
  log.toBg('Create bookmark request -> bg', request);
  await browser.runtime.sendMessage(request);
};

export const updateBookmark = async (bookmark) => {
  const request = {
    action: 'update-bookmark',
    payload: bookmark
  };
  log.toBg('Update bookmark request -> bg', request);
  await browser.runtime.sendMessage(request);
};

export const removeBookmark = async (bookmark) => {
  const request = {
    action: 'remove-bookmark',
    payload: bookmark
  };
  log.toBg('Remove bookmark request -> bg', request);
  await browser.runtime.sendMessage(request);
};

export default {
  getAllBookmarks,
  addBookmark,
  updateBookmark,
  removeBookmark,
  onSignInComplete
};
