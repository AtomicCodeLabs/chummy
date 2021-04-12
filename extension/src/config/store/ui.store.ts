/* global chrome */
import { observable, action, computed } from 'mobx';

import IUiStore, {
  Language,
  SidebarView,
  TreeSection,
  TreeState,
  UiStorePropsArray,
  UiStoreKeys,
  SectionName,
  Notification,
  NotificationType,
  ErrorTypes,
  WarningTypes
} from './I.ui.store';
import { SPACING, SIDEBAR_SIDE } from '../../global/constants';
import { STORE_DEFAULTS } from './constants';
import { getFromChromeStorage, setInChromeStorage } from './util';
import { isBlank } from '../../utils';
import IUserStore from './I.user.store';
import IRootStore from './I.root.store';

export default class UiStore implements IUiStore {
  userStore: IUserStore;

  @observable language: Language;
  @observable theme: string;
  @observable spacing: SPACING;
  @observable pendingRequestCount: Map<SectionName, number>;
  @observable isStickyWindow: boolean;
  @observable isDistractionFreeMode: boolean;
  @observable pendingNotifications: Map<string, Notification>;
  @observable notifications: Map<string, Notification>;
  @observable isPopup: boolean;
  @observable sidebarView: SidebarView;
  @observable sidebarWidth: number;
  @observable sidebarSide: SIDEBAR_SIDE;
  @observable isSidebarMinimized: boolean;
  @observable isTreeSectionMinimized: {
    [TreeSection.Sessions]: TreeState;
    [TreeSection.OpenTabs]: TreeState;
    [TreeSection.Files]: TreeState;
  };
  @observable isSearchSectionMinimized: boolean;
  @observable selectedQueryFilename: string;
  @observable selectedQueryCode: string;
  @observable selectedQueryPath: string;
  @observable selectedOpenRepo: string;
  @observable selectedLanguage: string;
  @observable isBookmarksSectionMinimized: boolean;
  @observable selectedBookmarkQuery: string;
  @observable selectedBookmarkRepo: string;
  @observable openBookmarkRepos: Set<string>;

  static BLOCKLISTED_KEYS = [
    'pendingRequestCount',
    'userStore',
    'pendingNotifications',
    'notifications'
  ];

  constructor(rootStore: IRootStore) {
    this.userStore = rootStore.userStore;
    this.init();
  }

  // Initialize
  @action.bound init = () => {
    // Set defaults
    Object.entries(STORE_DEFAULTS.UI).forEach(([key, value]) => {
      // @ts-ignore: Hard to type
      this[key] = value;
    });

    // Get keys of IUiStore
    const keys: UiStorePropsArray = UiStoreKeys;

    // Keep some keys out of chrome storage
    const filteredKeys = keys
      .filter((k) => !UiStore.BLOCKLISTED_KEYS.includes(k))
      .sort();

    // Get and set previous sessions' settings
    getFromChromeStorage(filteredKeys, (items: { [key: string]: any }) => {
      // Set each key
      filteredKeys.forEach((key) => {
        if (items[key]) {
          // @ts-ignore: Hard to type
          this[key] = items[key];
        }
      });

      // Set defaults but don't overwrite previous
      setInChromeStorage(
        filteredKeys.reduce((o, key) => ({ ...o, [key]: this[key] }), {})
      );
    });
  };

  @action.bound clear() {
    // Set defaults
    Object.entries(STORE_DEFAULTS.UI).forEach(([key, value]) => {
      if (!UiStore.BLOCKLISTED_KEYS.includes(key)) {
        // @ts-ignore: Hard to type
        this[key] = value;
      }
    });
    // Set defaults in store
    setInChromeStorage(
      Object.keys(STORE_DEFAULTS.UI).reduce(
        (o, key) => ({ ...o, [key]: STORE_DEFAULTS.UI[key] || null }),
        {}
      )
    );
  }

  @action.bound addPendingRequest = (pendingState: SectionName): void => {
    const pastCount = this.pendingRequestCount.get(pendingState) || 0;
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

  @action.bound setSpacing = (spacing: SPACING): void => {
    setInChromeStorage({ spacing });
    this.spacing = spacing;
  };

  @action.bound setIsStickyWindow = (isStickyWindow: boolean): void => {
    setInChromeStorage({ isStickyWindow });
    this.isStickyWindow = isStickyWindow;
  };

  @action.bound setIsDistractionFreeMode = (
    isDistractionFreeMode: boolean
  ): void => {
    setInChromeStorage({ isDistractionFreeMode });
    this.isDistractionFreeMode = isDistractionFreeMode;
  };

  @action.bound addErrorPendingNotification = (error: {
    name: keyof typeof ErrorTypes;
    message: string;
    stack: any;
  }) => {
    const id = `${NotificationType.Error}-${Date.now()}`;
    this.pendingNotifications.set(id, {
      id,
      type: NotificationType.Error,
      title: ErrorTypes[error.name],
      message: isBlank(error?.message)
        ? 'An unexpected error occurred.'
        : error?.message
    });
  };

  @action.bound addWarningPendingNotification = (error: {
    name: keyof typeof WarningTypes;
    message: string;
    stack: any;
  }) => {
    const id = `${NotificationType.Warning}-${Date.now()}`;
    this.pendingNotifications.set(id, {
      id,
      type: NotificationType.Warning,
      title: WarningTypes[error.name],
      message: isBlank(error?.message)
        ? 'Something unexpected happened.'
        : error?.message
    });
  };

  @action.bound addGenericPendingNotification = (
    title: string,
    message: string,
    type: NotificationType
  ) => {
    const id = `${type}-${Date.now()}`;
    this.pendingNotifications.set(id, {
      id,
      type,
      title,
      message
    });
  };

  /**
   * Left pops oldest notification in map (Map preserves order of insertion)
   * and enqueues into `notifications` to persist it in cache
   */
  @action.bound popPendingNotifications = () => {
    if (!this.pendingNotifications.size) return;
    const oldestKey = this.pendingNotifications.keys().next().value;
    const notification = this.pendingNotifications.get(oldestKey);
    this.pendingNotifications.delete(oldestKey);
    this.notifications.set(oldestKey, notification);
    return notification;
  };

  @action.bound removeNotification = (notification: Notification) => {
    if (this.notifications.has(notification.id)) {
      this.notifications.delete(notification.id);
    }
  };

  @action.bound clearNotifications = () => {
    this.notifications.clear();
  };

  @computed get numOfNotifications() {
    return this.notifications.size;
  }

  @action.bound setIsPopup = (isPopup: boolean) => {
    setInChromeStorage({ isPopup });
    this.isPopup = isPopup;
  };

  @action.bound setSidebarSide = (sidebarSide: SIDEBAR_SIDE) => {
    setInChromeStorage({ sidebarSide });
    this.sidebarSide = sidebarSide;
  };

  @action.bound setSidebarWidth = (
    width: number,
    setInChrome: boolean = false
  ) => {
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
    const foundTreeState = this.isTreeSectionMinimized[sectionName];
    this.isTreeSectionMinimized = {
      ...this.isTreeSectionMinimized,
      [sectionName]: {
        ...foundTreeState,
        isMinimized: !foundTreeState.isMinimized
      }
    };
    setInChromeStorage({
      isTreeSectionMinimized: this.isTreeSectionMinimized
    });
  };

  @action.bound setTreeSectionHeight = (
    sectionName: TreeSection,
    height: number
  ) => {
    this.isTreeSectionMinimized = {
      ...this.isTreeSectionMinimized,
      [sectionName]: {
        ...this.isTreeSectionMinimized[sectionName],
        lastHeight: height
      }
    };
    setInChromeStorage({
      isTreeSectionMinimized: this.isTreeSectionMinimized
    });
  };

  @action.bound toggleSearchSection = () => {
    this.isSearchSectionMinimized = !this.isSearchSectionMinimized;
    setInChromeStorage({
      isSearchSectionMinimized: this.isSearchSectionMinimized
    });
  };

  @action.bound setSelectedQueryFilename = (selectedQuery: string) => {
    this.selectedQueryFilename = selectedQuery;
  };

  @action.bound setSelectedQueryCode = (selectedQuery: string) => {
    this.selectedQueryCode = selectedQuery;
  };

  @action.bound setSelectedQueryPath = (selectedQuery: string) => {
    this.selectedQueryPath = selectedQuery;
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
