/* global chrome */
import { observable, action, computed, toJS } from 'mobx';

import IUiStore, {
  Language,
  SidebarView,
  TreeSection,
  UiStorePropsArray,
  UiStoreKeys,
  SectionName,
  Spacing
} from './I.ui.store';
import { EXTENSION_WIDTH } from '../../constants/sizes';
import { getFromChromeStorage, setInChromeStorage } from './util';
import { THEME_NAMES } from '../../config/theme/selector';
import IUserStore from './I.user.store';
import IRootStore from './I.root.store';

export default class UiStore implements IUiStore {
  userStore: IUserStore;

  @observable language = Language.English;
  @observable theme = THEME_NAMES[0];
  @observable spacing = Spacing.Comfortable;
  @observable pendingRequestCount = new Map(
    Object.values(SectionName).map((sectionName) => [sectionName, 0])
  );
  @observable isStickyWindow = false;
  @observable sidebarView = SidebarView.Project;
  @observable sidebarWidth = EXTENSION_WIDTH.INITIAL;
  @observable isSidebarMinimized = false;
  @observable isTreeSectionMinimized = {
    [TreeSection.OpenTabs]: false,
    [TreeSection.Files]: false
  };
  @observable isSearchSectionMinimized = true;
  @observable selectedQuery: string = null;
  @observable selectedOpenRepo: string = null;
  @observable selectedLanguage: string = null;
  // @observable openSearchResultFiles: Set<string> = new Set();
  @observable isBookmarksSectionMinimized = true;
  @observable selectedBookmarkQuery: string = null;
  @observable selectedBookmarkRepo: string = null;
  @observable openBookmarkRepos: Set<string> = new Set();

  constructor(rootStore: IRootStore) {
    this.userStore = rootStore.userStore;
    this.init();
  }

  // Initialize
  @action.bound init = () => {
    // Get keys of IUiStore
    const keys: UiStorePropsArray = UiStoreKeys;

    // Get and set previous sessions' settings
    getFromChromeStorage(keys, (items: { [key: string]: any }) => {
      // Keep some keys out of chrome storage
      const filteredKeys = keys.filter(
        (k) => !['pendingRequestCount'].includes(k)
      );

      // Set each key
      filteredKeys.forEach((key) => {
        if (items[key]) {
          (this[key] as any) = items[key];
        }
      });

      // Set defaults but don't overwrite previous
      setInChromeStorage(
        keys.reduce((o, key) => ({ ...o, [key]: this[key] }), {})
      );
    });
  };

  @action.bound addPendingRequest = (pendingState: SectionName): void => {
    const pastCount = this.pendingRequestCount.get(pendingState);
    this.pendingRequestCount.set(pendingState, pastCount + 1);
  };

  @action.bound removePendingRequest = (pendingState: SectionName): void => {
    const pastCount = this.pendingRequestCount.get(pendingState);
    this.pendingRequestCount.set(pendingState, Math.max(pastCount - 1, 0));
  };

  @action.bound isSectionPending = (pendingState: SectionName): boolean => {
    return !!this.pendingRequestCount.get(pendingState);
  };

  @action.bound setTheme = (theme: string): void => {
    setInChromeStorage({ theme });
    this.theme = theme;
  };

  @action.bound setSpacing = (spacing: Spacing): void => {
    setInChromeStorage({ spacing });
    this.spacing = spacing;
  };

  @action.bound setIsStickyWindow = (isStickyWindow: boolean): void => {
    setInChromeStorage({ isStickyWindow });
    this.isStickyWindow = isStickyWindow;
  };

  @action.bound setSidebarWidth = (
    width: number,
    setInChrome: boolean = false
  ): void => {
    if (setInChrome) setInChromeStorage({ sidebarWidth: width });
    this.sidebarWidth = width;
  };

  @action.bound openSidebar = () => {
    if (!this.isSidebarMinimized) return;
    setInChromeStorage({ isSidebarMinimized: false });
    this.isSidebarMinimized = false;
  };

  @action.bound closeSidebar = () => {
    if (this.isSidebarMinimized) return;
    setInChromeStorage({ isSidebarMinimized: true });
    this.isSidebarMinimized = true;
  };

  @action.bound toggleTreeSection = (sectionName: TreeSection) => {
    this.isTreeSectionMinimized = {
      ...this.isTreeSectionMinimized,
      [sectionName]: !this.isTreeSectionMinimized[sectionName]
    };
  };

  @action.bound toggleSearchSection = () => {
    this.isSearchSectionMinimized = !this.isSearchSectionMinimized;
    setInChromeStorage({
      isSearchSectionMinimized: this.isSearchSectionMinimized
    });
  };

  @action.bound setSelectedQuery = (selectedQuery: string) => {
    this.selectedQuery = selectedQuery;
  };

  @action.bound setSelectedOpenRepo = (selectedOpenRepo: string) => {
    this.selectedOpenRepo = selectedOpenRepo;
  };

  @action.bound setSelectedLanguage = (selectedLanguage: string) => {
    this.selectedLanguage = selectedLanguage;
  };

  // Not needed because search results aren't cached as of now
  // @action.bound openOpenSearchResultFile = (filePath: string) => {
  //   this.openSearchResultFiles.add(filePath);
  // };

  // @action.bound closeOpenSearchResultFile = (filePath: string) => {
  //   this.openSearchResultFiles.delete(filePath);
  // };

  // @action.bound clearOpenSearchResultFiles = () => {
  //   this.openSearchResultFiles.clear();
  // };

  // @action.bound isOpenSearchResultFileOpen = (filePath: string) => {
  //   return this.openSearchResultFiles.has(filePath);
  // };

  @action.bound toggleBookmarksSection = () => {
    this.isBookmarksSectionMinimized = !this.isBookmarksSectionMinimized;
    setInChromeStorage({
      isBookmarksSectionMinimized: this.isBookmarksSectionMinimized
    });
  };

  @action.bound setSelectedBookmarkQuery = (selectedBookmarkQuery: string) => {
    this.selectedBookmarkQuery = selectedBookmarkQuery;
  };

  @action.bound setSelectedBookmarkRepo = (selectedBookmarkRepo: string) => {
    this.selectedBookmarkRepo = selectedBookmarkRepo;
  };
}
