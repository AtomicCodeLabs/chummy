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

export const onUpdateOpenRepositories = ({
  create = () => {},
  remove = () => {}
}) => {
  const toCall = (request) => {
    if (request.action === 'tab-updated') {
      switch (request.payload.status) {
        case 'create':
          create(request.payload);
          break;
        case 'remove':
          remove(request.payload);
          break;
        default:
          break;
      }
    }
  };
  chrome.runtime.onMessage.addListener(toCall);

  return () => chrome.runtime.onMessage.removeListener(toCall);
};
