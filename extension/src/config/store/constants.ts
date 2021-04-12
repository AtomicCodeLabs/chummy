/* eslint-disable import/prefer-default-export */
import { SPACING, APP_URLS, SIDEBAR_SIDE } from '../../global/constants';
import { EXTENSION_WIDTH } from '../../constants/sizes';
import { Language, SidebarView, TreeSection } from './I.ui.store';
import { Session } from './I.file.store';

const INITIAL_SESSION: Session = {
  id: 'session-1',
  name: 'welcome-session',
  tabs: [
    {
      name: 'Chummy Tutorial',
      url: new URL(APP_URLS.WEBSITE.TUTORIAL, APP_URLS.WEBSITE.BASE).toString()
    }
  ]
};

export const STORE_DEFAULTS: any = {
  FILE: {
    isPending: true,
    currentWindowTab: null,
    cachedNodes: new Map(),
    openRepos: new Map(),
    lastNOpenTabIds: new Set(),
    currentBranch: null,
    currentSession: INITIAL_SESSION,
    currentRepo: null
  },
  USER: {
    user: null,
    userBookmarks: new Map(), // key is owner:branchName
    numOfBookmarks: 0,
    userSessions: new Map(), // key is session id
    numOfSessions: 0,
    isPending: null, // keep boolean bc user pending requests are binary
    error: null // sign in error, null if none
  },
  UI: {
    language: Language.English,
    theme: 'vanilla-light', // hardcode in so it doesn't have to wait for themes to load
    spacing: SPACING.Cozy,
    pendingRequestCount: new Map(),
    isStickyWindow: false,
    isDistractionFreeMode: false,
    pendingNotifications: new Map(), // frontend pops from queue until map is empty
    notifications: new Map(), // notificationsToShow end up here once processed
    sidebarView: SidebarView.Project,
    sidebarWidth: EXTENSION_WIDTH.INITIAL, // Last seen sidebar width, not 0 when sidebar is minimized
    sidebarSide: SIDEBAR_SIDE.Left,
    isSidebarMinimized: false,
    isTreeSectionMinimized: {
      [TreeSection.Sessions]: { isMinimized: true, lastHeight: 200 },
      [TreeSection.OpenTabs]: { isMinimized: false, lastHeight: 200 },
      [TreeSection.Files]: { isMinimized: false, lastHeight: 200 }
    },
    isSearchSectionMinimized: true,
    selectedQueryFilename: null,
    selectedQueryCode: null,
    selectedQueryPath: null,
    selectedOpenRepo: null,
    selectedLanguage: null,
    isBookmarksSectionMinimized: true,
    selectedBookmarkQuery: null,
    selectedBookmarkRepo: null,
    openBookmarkRepos: new Set()
  }
};
