import { isGithubRepoUrl } from './util';

const initListeners = () => {};

const checkUrl = () => {
  // eslint-disable-next-line no-restricted-globals
  const isGRUrl = isGithubRepoUrl(location.href);
  if (isGRUrl) {
    initListeners();
  }
};

checkUrl();
