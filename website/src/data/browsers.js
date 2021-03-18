export const BROWSER_URLS = {
  CHROME:
    'https://chrome.google.com/webstore/detail/chummy/ocmdenamdoeigigibgjfnconlhpekfgb',
  FIREFOX: 'https://addons.mozilla.org/en-US/firefox/addon/chummy/',
  EDGE:
    'https://microsoftedge.microsoft.com/addons/detail/bpobpfbpikaikajipjoaoiijnkjikpfe',
  OPERA: 'https://addons.opera.com/en/extensions/details/chummy/'
};

const browsers = [
  {
    name: 'chrome',
    url: BROWSER_URLS.CHROME
  },
  {
    name: 'firefox',
    url: BROWSER_URLS.FIREFOX
  },
  {
    name: 'edge',
    url: BROWSER_URLS.EDGE
  },
  {
    name: 'opera',
    url: BROWSER_URLS.OPERA
  }
  // { name: 'safari' }
];

export default browsers;
