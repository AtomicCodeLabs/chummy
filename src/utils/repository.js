/* global chrome */

// eslint-disable-next-line import/prefer-default-export
export const getOpenRepositories = (callback = () => {}) =>
  chrome.runtime.sendMessage(
    { action: 'get-open-repositories' },
    (response) => {
      if (response) {
        callback(response.payload);
      }
    }
  );

export const transformOpenRepo = ({ owner, repo: name, branch }) => {
  return {
    owner,
    name,
    type: 'tree',
    branches: { [branch.name]: branch }
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
  chrome.runtime.onMessage.addListener(toCall);

  return () => chrome.runtime.onMessage.removeListener(toCall);
};
