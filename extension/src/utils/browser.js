import browser from 'webextension-polyfill';
import log from '../config/log';

export const redirectToUrl = (url) => {
  const request = {
    action: 'redirect-to-url',
    payload: { url }
  };
  log.toBg('Redirect to url request -> bg', request);
  browser.runtime.sendMessage(request);
};

export const openSession = (session) => {
  const request = {
    action: 'redirect-to-session',
    payload: { session }
  };
  log.toBg('Redirect to url request -> bg', request);
  browser.runtime.sendMessage(request);
};

export const updateSidebarSide = (prevSide, nextSide) => {
  const request = {
    action: 'sidebar-side-updated',
    payload: { prevSide, nextSide }
  };
  log.toBg('Update sidebar side request -> bg', request);
  browser.runtime.sendMessage(request);
};
