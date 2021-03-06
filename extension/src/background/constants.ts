/* eslint-disable camelcase */

export const GITHUB_REGEX = new RegExp(
  /^(http|https):\/\/github\.com(\/[^/]+){2,}$/
);

// "G-Desktop-Suite/gsuite.rb at revert-68-code-quality-66-prettify · alexkim205/G-Desktop-Suite"
export const REPO_TITLE_REGEX = new RegExp('(?: at )((?:[^ · ]*))');

export const generate_ISSUE_TITLE_REGEX = (issueId: number) =>
  new RegExp(`^(.*?) · Issue #${issueId}`);

export const generate_PULL_TITLE_REGEX = (pullId: number) =>
  new RegExp(`^(.*?) · Pull Request #${pullId}`);

export const NO_WINDOW_EXTENSION_ID = -1; // -3 if it doesn't exist

export const MIN_MAIN_WINDOW_WIDTH = 500;
