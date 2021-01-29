import { DEFAULT_BRANCH } from '../global/constants.ts';

const GITHUB_REGEX = new RegExp(/^(http|https):\/\/github\.com(\/[^/]+){2,}$/);

export const isGithubRepoUrl = (url) => {
  return url && !!GITHUB_REGEX.exec(url);
};

export const parseUrl = (url, title) => {
  if (!isGithubRepoUrl(url)) {
    return null;
  }

  const urlObject = new URL(url);

  // [alexkim205, tomaso, tree?/blob?, filePath?]
  const parsedRepoInfo = urlObject.pathname.slice(1).split('/');

  let payloadRepoInfo = {};
  const isAtRootAndMaster = parsedRepoInfo.length === 2;

  if (isAtRootAndMaster) {
    payloadRepoInfo = {
      url,
      owner: parsedRepoInfo[0],
      repo: parsedRepoInfo[1],
      branch: DEFAULT_BRANCH,
      type: 'tree',
      file: null
    };
  } else {
    // tabTitle looks like "G-Desktop-Suite/gsuite.rb at revert-68-code-quality-66-prettify · alexkim205/G-Desktop-Suite"
    // Get branch information from tab title, because it's impossible to discern from
    // just the url if the branch name has /'s
    const branch = title.match(new RegExp(' at (.*) · '))[1]; // get everything in between " at " and " . "
    const parsedWithoutBranch = urlObject.pathname
      .slice(1)
      .replace(`/${branch}`, '') // remove branch from url to get
      .split('/'); // [alexkim205, tomaso, tree?/blob?, filePath?]
    payloadRepoInfo = {
      url,
      owner: parsedRepoInfo[0],
      repo: parsedRepoInfo[1],
      branch,
      type: parsedWithoutBranch[2],
      file: parsedWithoutBranch[3]
    };
  }

  return payloadRepoInfo;
};
