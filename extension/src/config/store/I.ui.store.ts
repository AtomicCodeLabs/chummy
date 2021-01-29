import IUserStore from './I.user.store';
import { SIDEBAR_SIDE, SPACING } from '../../global/constants';

export enum Language {
  English = 'en_US'
}

export enum SidebarView {
  Project,
  Branches,
  'Changed Files',
  'Open Files'
}

export enum TreeSection {
  Sessions = 'sessions',
  OpenTabs = 'openTabs',
  Files = 'files'
}

export interface TreeState {
  isMinimized: boolean;
  lastHeight: number;
}

export enum SectionName {
  Tree = 'Explorer',
  Search = 'Search',
  VCS = 'Source Control',
  Bookmarks = 'Bookmarks',
  Account = 'Account',
  Settings = 'Settings',
  None = 'None'
}

export enum NotificationType {
  Success = 'Success',
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info'
}

export enum ErrorTypes {
  ThrottlingError = 'Throttling Error',
  UserError = 'Authentication Error',
  WindowError = 'Window Error',
  Error = 'Error'
}

export interface Notification {
  id?: string;
  title?: string;
  message: string;
  type?: NotificationType;
}

// UiStore
class CUiStore {
  userStore: IUserStore = null;

  language: Language = Language.English;
  theme: string = 'vanilla-light';
  spacing: SPACING = SPACING.Cozy;
  pendingRequestCount: Map<SectionName, number> = new Map(
    Object.values(SectionName).map((sectionName) => [sectionName, 0])
  );
  isStickyWindow: boolean = false;
  pendingNotifications: Map<string, Notification> = new Map();
  notifications: Map<string, Notification> = new Map();

  // Sidebar
  sidebarView: SidebarView = null;
  sidebarWidth: number = null;
  sidebarSide: SIDEBAR_SIDE = null;
  isSidebarMinimized: boolean = false;

  // Tree Page
  isTreeSectionMinimized: {
    [TreeSection.Sessions]: TreeState;
    [TreeSection.OpenTabs]: TreeState;
    [TreeSection.Files]: TreeState;
  } = {
    [TreeSection.Sessions]: { isMinimized: true, lastHeight: 0 },
    [TreeSection.OpenTabs]: { isMinimized: false, lastHeight: 50 },
    [TreeSection.Files]: { isMinimized: false, lastHeight: 50 }
  };

  // Search Page
  isSearchSectionMinimized: boolean = true;
  selectedQueryFilename: string = null;
  selectedQueryCode: string = null;
  selectedQueryPath: string = null;
  selectedOpenRepo: string = null;
  selectedLanguage: string = null;
  // openSearchResultFiles: Set<string>;

  // Bookmarks Page
  isBookmarksSectionMinimized: boolean = true;
  selectedBookmarkQuery: string = null;
  selectedBookmarkRepo: string = null;
  openBookmarkRepos: Set<string>;
}

export default interface IUiStore extends CUiStore {
  removePendingRequest(pendingState: SectionName): void;
  addPendingRequest(pendingState: SectionName): void;
}

export type UiStorePropsArray = Array<keyof IUiStore>;

export const UiStoreKeys = Object.keys(new CUiStore()) as UiStorePropsArray;
