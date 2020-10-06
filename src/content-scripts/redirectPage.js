/* global chrome */

console.log('REDIRECT PAGE LOADED');

// eslint-disable-next-line import/prefer-default-export
export const redirectPageListeners = () => {
  chrome.runtime.onMessage.addListener((request) => {
    // Make a ajax redirect request
    if (request.action === 'redirect-content-script') {
      const {
        payload: { base, filepath }
      } = request;

      // Hack: simulate a click on the repository <a> tag by replacing the href
      // with the file to redirect to. This gives us a reliable reference element
      // to "click" any time any file is chosen.
      const repoLink = document.querySelector(
        `[data-pjax='#js-repo-pjax-container'][href='${base}']`
      );
      // If navigated to page that doesn't have clickable repo link (like 404)
      // fallback to normal redirect.
      if (!repoLink) {
        window.location.href = `https://github.com${base}${filepath}`;
      } else {
        // Sometimes ajax redirect will be treated as a normal redirect by Github
        repoLink.setAttribute('href', base + filepath);
        repoLink.click();
      }
    }
  });
};
