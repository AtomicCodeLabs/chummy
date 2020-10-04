import { isGithubRepoUrl } from './util';
import { redirectPageListeners } from './redirectPage';

const initListeners = () => {
  redirectPageListeners();
};

const checkUrl = () => {
  // eslint-disable-next-line no-restricted-globals
  const isGRUrl = isGithubRepoUrl(location.href);
  if (isGRUrl) {
    initListeners();
  }
};

checkUrl();
