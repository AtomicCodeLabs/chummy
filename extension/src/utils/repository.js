import browser from 'webextension-polyfill';

// eslint-disable-next-line import/prefer-default-export
export const getOpenRepositories = async (callback = () => {}) => {
  try {
    const request = {
      action: 'get-open-repositories'
    };
    console.log(
      '%cGet open repositories request -> bg',
      'background-color: #00c853; color: white;',
      request
    );
    const response = await browser.runtime.sendMessage(request);
    console.log('Response', response);

    if (response) {
      callback(response.payload);
    }
  } catch (error) {
    console.warn('Error getting open repositories', error);
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
