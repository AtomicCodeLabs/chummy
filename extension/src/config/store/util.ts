import { browser } from 'webextension-polyfill-ts';
import log from '../log';
import { BgRepo, Repo } from './I.file.store';

const clone = (obj: { [key: string]: any }) => {
  return JSON.parse(JSON.stringify(obj));
};

export const setInChromeStorage = (object: { [key: string]: any }) => {
  browser.runtime.sendMessage(clone({ action: 'set-store', payload: object }));
};

export const getFromChromeStorage = async (
  keys: string[],
  callback: Function
) => {
  try {
    const request = {
      action: 'get-store',
      payload: keys
    };
    log.toBg('Get store request -> bg', request);
    const response = await browser.runtime.sendMessage(clone(request));
    log.debug('Response', response);
    if (response?.payload) {
      callback(response.payload);
    }
  } catch (error) {
    log.error('Error getting store', keys, error);
  }
};

export const convertBgRepoToRepo = (bgRepo: BgRepo): Repo => {
  return {
    owner: bgRepo.owner,
    name: bgRepo.repo,
    tabs: {
      [bgRepo.tab.nodeName || bgRepo.tab.subpage]: {
        name: bgRepo.tab.name,
        tabId: bgRepo.tab.tabId,
        nodeName: bgRepo.tab.nodeName,
        subpage: bgRepo.tab.subpage
      }
    },
    type: bgRepo.type,
    defaultBranch: bgRepo.defaultBranch
  };
};
