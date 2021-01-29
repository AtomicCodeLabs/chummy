/* global chrome */
import { observable, action, toJS } from 'mobx';

import IUiStore, {
  Language,
  SidebarView,
  TreeSection,
  UiStorePropsArray,
  UiStoreKeys,
  SectionName,
  Notification,
  NotificationType,
  ErrorTypes
} from './I.ui.store';
import { SPACING, SIDEBAR_SIDE } from '../../global/constants';
import { EXTENSION_WIDTH } from '../../constants/sizes';
import { getFromChromeStorage, setInChromeStorage } from './util';
import IUserStore from './I.user.store';
import IRootStore from './I.root.store';

export default class UiStore implements IUiStore {
  userStore: IUserStore;

  @observable language = Language.English;
  @observable theme = 'vanilla-light'; // hardcode in so it doesn't have to wait for themes to load
  @observable spacing = SPACING.Cozy;
  @observable pendingRequestCount = new Map(
    Object.values(SectionName).map((sectionName) => [sectionName, 0])
  );
  @observable isStickyWindow = false;
  @observable pendingNotifications: Map<string, Notification> = new Map(); // frontend pops from queue until map is empty
  @observable notifications: Map<string, Notification> = new Map(); // notificationsToShow end up here once processed
  @observable sidebarView = SidebarView.Project;
  @observable sidebarWidth = EXTENSION_WIDTH.INITIAL; // Last seen sidebar width, not 0 when sidebar is minimized
  @observable sidebarSide = SIDEBAR_SIDE.Left;
  @observable isSidebarMinimized = false;
  @observable isTreeSectionMinimized = {
    [TreeSection.Sessions]: { isMinimized: true, lastHeight: 200 },
    [TreeSection.OpenTabs]: { isMinimized: false, lastHeight: 200 },
    [TreeSection.Files]: { isMinimized: false, lastHeight: 200 }
  };
  @observable isSearchSectionMinimized = true;
  @observable selectedQueryFilename: string = null;
  @observable selectedQueryCode: string = null;
  @observable selectedQueryPath: string = null;
  @observable selectedOpenRepo: string = null;
  @observable selectedLanguage: string = null;
  // @observable openSearchResultFiles: Set<string> = new Set();
  @observable isBookmarksSectionMinimized = true;
  @observable selectedBookmarkQuery: string = null;
  @observable selectedBookmarkRepo: string = null;
  @observable openBookmarkRepos: Set<string> = new Set();

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

  @action.bound setSpacing = (spacing: SPACING): void => {
    setInChromeStorage({ spacing });
    this.spacing = spacing;
  };

  @action.bound setIsStickyWindow = (isStickyWindow: boolean): void => {
    setInChromeStorage({ isStickyWindow });
    this.isStickyWindow = isStickyWindow;
  };

  @action.bound addErrorPendingNotification = (error: {
    name: keyof typeof ErrorTypes;
    message: string;
    stack: any;
  }) => {
    const id = `${NotificationType.Error}-${this.notifications.size}`;
    this.pendingNotifications.set(id, {
      id,
      type: NotificationType.Error,
      title: ErrorTypes[error.name],
      message: error.message
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

  @action.bound setSidebarSide = (sidebarSide: SIDEBAR_SIDE): void => {
    setInChromeStorage({ sidebarSide });
    this.sidebarSide = sidebarSide;
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
