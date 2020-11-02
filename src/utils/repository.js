import browser from 'webextension-polyfill';

// eslint-disable-next-line import/prefer-default-export
export const getOpenRepositories = async (callback = () => {}) => {
  try {
    const response = await browser.runtime.sendMessage({
      action: 'get-open-repositories'
    });
    if (response) {
      callback(response.payload);
    }
  } catch (error) {
    console.error('Error getting open repositories', error);
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
