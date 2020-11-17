const browser = require('webextension-polyfill');

console.log('LOADED');

// eslint-disable-next-line import/prefer-default-export
const redirectPageListeners = () => {
  browser.runtime.onMessage.addListener(function redirectListener(request) {
    // Make a ajax redirect request
    if (request.action === 'redirect-content-script') {
      // Garbage collect event listener (listen at most once)
      browser.runtime.onMessage.removeListener(redirectListener);

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

redirectPageListeners();
