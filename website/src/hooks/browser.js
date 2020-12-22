/* global chrome */
import loadable from '@loadable/component';

export default () => {
  chrome.runtime.id = 'chummy-website';
  const browser = loadable.lib(() => import('webextension-polyfill'));
  return { browser };
};
