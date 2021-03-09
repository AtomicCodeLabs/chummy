import browser from 'webextension-polyfill';
import cloneDeep from 'lodash.clonedeep';

import log from '../../../config/log';

// eslint-disable-next-line import/prefer-default-export
export const toggleDistractionFreeMode = (isDistractionFreeMode) => {
  const request = cloneDeep({
    action: 'distraction-free',
    payload: { isDistractionFreeMode }
  });
  log.toBg('Redirect request -> bg', request);
  browser.runtime.sendMessage(request);
};
