import browser from 'webextension-polyfill';
import log from '../config/log';

// eslint-disable-next-line import/prefer-default-export
export const getOpenRepositories = async (callback = () => {}) => {
  try {
    const request = {
      action: 'get-open-repositories'
    };
    log.toBg('Get open repositories request -> bg', request);
    const response = await browser.runtime.sendMessage(request);
    log.debug('Response', response);

    if (response) {
      callback(response.payload);
    }
  } catch (error) {
    log.error('Error getting open repositories', error);
  }
};

export const transformOpenRepo = (p) => {
  const { owner, repo: name, tab } = p;
  return {
    owner,
    name,
    type: 'tree',
    tabs: { [tab.nodeName || tab.subpage]: tab }
  };
};

export const repoMapToArray = (repoMap) =>
  Object.values(repoMap)
    .flat()
    .map((r) => transformOpenRepo(r));

export const onUpdateOpenRepositories = (callback = () => {}) => {
  const toCall = (request) => {
    if (request.action === 'tab-updated') {
      callback(request.payload);
    }
  };
  browser.runtime.onMessage.addListener(toCall);

  return () => browser.runtime.onMessage.removeListener(toCall);
};
