/* global chrome */

// eslint-disable-next-line import/prefer-default-export
export const inActiveTab = (callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    callback(tabs);
  });
};

const GITHUB_REGEX = new RegExp(/^(http|https):\/\/github\.com(\/[^/]+){2,}$/);

export const isGithubRepoUrl = (url) => {
  return url && !!GITHUB_REGEX.exec(url);
};

export const parseUrl = (url, title, tabId = null) => {
  if (!isGithubRepoUrl(url)) {
    return null;
  }

  const urlObject = new URL(url);

  // [alexkim205, tomaso, tree?/blob?, filePath?]
  const parsedRepoInfo = urlObject.pathname.slice(1).split('/');

  let payloadRepoInfo = {};
  const isAtRootAndMaster =
    parsedRepoInfo.length === 2 ||
    (parsedRepoInfo.length === 4 && parsedRepoInfo[3] === 'master');

  if (isAtRootAndMaster) {
    payloadRepoInfo = {
      url,
      owner: parsedRepoInfo[0],
      repo: parsedRepoInfo[1],
      branch: { name: 'master', tabId },
      type: 'tree',
      file: null
    };
  } else {
    // tabTitle looks like "G-Desktop-Suite/gsuite.rb at revert-68-code-quality-66-prettify · alexkim205/G-Desktop-Suite"
    // Get branch information from tab title, because it's impossible to discern from
    // just the url if the branch name has /'s
    const regexedTitle = title.match(new RegExp('(?: at )((?:[^ · ]*))'));
    // Get everything in between " at " and " . "; fallback to getting url from url
    const branchName = regexedTitle ? regexedTitle[1] : parsedRepoInfo[3];
    const parsedWithoutBranch = urlObject.pathname
      .slice(1)
      .replace(`/${branchName}`, '') // remove branch from url to get
      .split('/'); // [alexkim205, tomaso, tree?/blob?, filePath?]
    payloadRepoInfo = {
      url,
      owner: parsedRepoInfo[0],
      repo: parsedRepoInfo[1],
      branch: { name: branchName, tabId },
      type: parsedWithoutBranch[2],
      file: parsedWithoutBranch[3]
    };
  }

  return payloadRepoInfo;
};
