/* global chrome */

export const redirectTo = (slug) => {
  chrome.runtime.sendMessage(
    { action: 'redirect', slug }
    // (response) => {
    // if (response) {
    //   const jsRepoPjaxContainer = document.querySelector(
    //     '#js-repo-pjax-container'
    //   );
    //   console.log('IN RESPONSE', response.payload);
    //   jsRepoPjaxContainer.innerHTML = response.payload.html;
    // }
    // }
  );
};

export const FILLER = 0;
