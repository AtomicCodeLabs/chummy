import browser from 'webextension-polyfill';
import log from '../config/log';
import { handleResponse, unproxifyBookmark } from '.';

export const onSignInComplete = (callback = () => {}) => {
  const toCall = (request) => {
    if (request.action === 'sign-in-complete') {
      callback(request);
    }
  };
  browser.runtime.onMessage.addListener(toCall);
};

export const getAllBookmarks = async () => {
  const request = {
    action: 'get-bookmarks'
  };
  log.toBg('Get bookmarks request -> bg', request);
  const response = await browser.runtime.sendMessage(request);
  return handleResponse(response);
};

export const addBookmark = async (bookmark) => {
  const request = {
    action: 'create-bookmark',
    payload: unproxifyBookmark(bookmark)
  };
  log.toBg('Create bookmark request -> bg', request);
  const response = await browser.runtime.sendMessage(request);
  return handleResponse(response);
};

export const updateBookmark = async (bookmark) => {
  const request = {
    action: 'update-bookmark',
    payload: unproxifyBookmark(bookmark)
  };
  log.toBg('Update bookmark request -> bg', request);
  const response = await browser.runtime.sendMessage(request);
  return handleResponse(response);
};

export const removeBookmark = async (bookmark) => {
  const request = {
    action: 'remove-bookmark',
    payload: unproxifyBookmark(bookmark)
  };
  log.toBg('Remove bookmark request -> bg', request);
  const response = await browser.runtime.sendMessage(request);
  return handleResponse(response);
};

export default {
  getAllBookmarks,
  addBookmark,
  updateBookmark,
  removeBookmark,
  onSignInComplete
};
