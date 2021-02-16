import { browser } from 'webextension-polyfill-ts';
import { BgRepo, Repo, Tab } from './I.file.store';
import log from '../log';

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
    if (response?.payload) {
      callback(response.payload);
    }
  } catch (error) {
    log.error('Error getting store', keys, error);
  }
};

export const convertBgRepoToRepo = (
  bgRepo: BgRepo,
  populate: boolean = true
): Repo => {
  return {
    owner: bgRepo.owner,
    name: bgRepo.repo,
    type: bgRepo.type,
    defaultBranch: bgRepo.defaultBranch,
    ...(populate && {
      tabs: {
        [bgRepo.tab.nodeName || bgRepo.tab.subpage]: {
          name: bgRepo.tab.name,
          tabId: bgRepo.tab.tabId,
          nodeName: bgRepo.tab.nodeName,
          subpage: bgRepo.tab.subpage
        }
      }
    })
  };
};

export const convertBgRepoToTabs = (bgRepos: BgRepo[]): Tab[] => {
  return bgRepos.map((bgRepo: BgRepo) => ({
    name: bgRepo.tab.name,
    tabId: bgRepo.tab.tabId,
    nodeName: bgRepo.tab.nodeName,
    subpage: bgRepo.tab.subpage,
    repo: convertBgRepoToRepo(bgRepo, false)
  }));
};
