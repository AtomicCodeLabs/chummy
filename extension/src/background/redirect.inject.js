import browser from 'webextension-polyfill';
// eslint-disable-next-line import/prefer-default-export
const redirectPageListeners = () => {
  browser.runtime.onMessage.addListener(function redirectListener(request) {
    // Make a ajax redirect request
    if (request.action === 'redirect-content-script') {
      // Garbage collect event listener (listen at most once)
      browser.runtime.onMessage.removeListener(redirectListener);

      const {
        payload: { owner, repo, type, branch, nodePath }
      } = request;

      // Hack: simulate a click on the repository <a> tag by replacing the href
      // with the file to redirect to. This gives us a reliable reference element
      // to "click" any time any file is chosen.
      const repoLink = document.querySelector(
        `[data-pjax='#js-repo-pjax-container'][href='/${owner}/${repo}']`
      );
      // If navigated to page that doesn't have clickable repo link (like 404)
      // fallback to normal redirect.
      if (!repoLink) {
        window.location.href = `https://github.com/${owner}/${repo}/${type}/${branch}/${nodePath}`;
      } else {
        // Sometimes ajax redirect will be treated as a normal redirect by Github
        repoLink.setAttribute(
          'href',
          `/${owner}/${repo}/${type}/${branch}/${nodePath}`
        );
        repoLink.click();
      }
    }
  });
};

redirectPageListeners();
