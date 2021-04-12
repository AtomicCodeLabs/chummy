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

// Prefixes
export enum ErrorTypes {
  ThrottlingError = 'Throttling Error',
  UserError = 'Authentication Error',
  WindowError = 'Window Error',
  Error = 'Error'
}

export enum WarningTypes {
  ThrottlingError = 'Throttling Warning',
  UserError = 'Authentication Warning',
  WindowError = 'Window Warning',
  Error = 'Warning'
}

export interface Notification {
  id?: string;
  title?: string;
  message: string;
  type?: NotificationType;
}

// UiStore
class CUiStore {
  userStore: IUserStore;

  language: Language;
  theme: string;
  spacing: SPACING;
  pendingRequestCount: Map<SectionName, number>;
  isStickyWindow: boolean;
  isDistractionFreeMode: boolean;
  pendingNotifications: Map<string, Notification>;
  notifications: Map<string, Notification>;

  // Sidebar
  sidebarView: SidebarView;
  sidebarWidth: number;
  sidebarSide: SIDEBAR_SIDE;
  isSidebarMinimized: boolean;

  // Tree Page
  isTreeSectionMinimized: {
    [TreeSection.Sessions]: TreeState;
    [TreeSection.OpenTabs]: TreeState;
    [TreeSection.Files]: TreeState;
  };

  // Search Page
  isSearchSectionMinimized: boolean;
  selectedQueryFilename: string;
  selectedQueryCode: string;
  selectedQueryPath: string;
  selectedOpenRepo: string;
  selectedLanguage: string;
  // openSearchResultFiles: Set<string>;

  // Bookmarks Page
  isBookmarksSectionMinimized: boolean;
  selectedBookmarkQuery: string;
  selectedBookmarkRepo: string;
  openBookmarkRepos: Set<string>;
}

export default interface IUiStore extends CUiStore {
  removePendingRequest(pendingState: SectionName): void;
  addPendingRequest(pendingState: SectionName): void;
  addErrorPendingNotification(error: Error): void;
  addWarningPendingNotification(error: Error): void;
}

export type UiStorePropsArray = Array<keyof IUiStore>;

export const UiStoreKeys = Object.keys(new CUiStore()) as UiStorePropsArray;
