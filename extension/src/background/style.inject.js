import browser from 'webextension-polyfill';

console.log('STYLE INJECTED');

const queriesThatDistract = [
  { selector: 'header.Header', n: 1 },
  { selector: 'nav[aria-label="Repository"].js-repo-nav', n: 1 },
  { selector: '.flash', n: 'all' },
  { selector: '.repository-content .Box', n: 1 },
  { selector: '.footer', n: 1 },
  { selector: 'ul.pagehead-actions', n: 1 },
  { selector: '#branch-select-menu', n: 1 },
  { selector: '#blob-more-options-details', n: 1 }
];

const stylizeElement = ({ selector, n }, cssText) => {
  if (n === 'all') {
    const els = document.querySelectorAll(selector);
    els.forEach((el) => {
      if (el) {
        el.style.cssText = cssText;
      }
    });
  } else {
    const el = document.querySelector(selector);
    if (el) {
      el.style.cssText = cssText;
    }
  }
};

const handleDFModeToggle = (isDistractionFreeMode) => {
  // If toggle on, re-display hidden elements
  if (isDistractionFreeMode) {
    queriesThatDistract.forEach((el) => {
      stylizeElement(el, 'display: none!important;');
    });
  }
  // Else toggle off, and hide elements
  else {
    queriesThatDistract.forEach((el) => {
      stylizeElement(el, null);
    });
  }
};

const initializeStyleListeners = () => {
  browser.runtime.onMessage.addListener(function styleListener(request) {
    // Make a ajax redirect request
    if (request.action === 'distraction-free-content-script') {
      // Garbage collect event listener (listen at most once)
      browser.runtime.onMessage.removeListener(styleListener);

      const {
        payload: { isDistractionFreeMode }
      } = request;

      handleDFModeToggle(isDistractionFreeMode);

      // Remove any existing event listeners
      window.removeEventListener('pjax:end', () => {
        handleDFModeToggle(isDistractionFreeMode);
      });
      // Add newest event listener so that toggle will be applied
      // even after page redirects
      window.addEventListener('pjax:end', () => {
        handleDFModeToggle(isDistractionFreeMode);
      });
    }
  });
};

initializeStyleListeners();
