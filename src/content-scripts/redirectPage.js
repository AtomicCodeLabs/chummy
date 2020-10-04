/* global chrome */
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
      repoLink.setAttribute('href', base + filepath);
      console.log(
        'HELLO',
        repoLink,
        base,
        filepath,
        document.querySelector(
          `[data-pjax='#js-repo-pjax-container'][href='${base + filepath}']`
        )
      );
      repoLink.click();
    }
  });
};
