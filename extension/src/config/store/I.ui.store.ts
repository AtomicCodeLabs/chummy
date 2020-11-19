import { THEME_NAMES } from '../../config/theme/selector';
import IUserStore from './I.user.store';

export enum Language {
  English = 'en_US'
}

export enum Spacing {
  Compact = 'compact',
  Cozy = 'cozy',
  Comfortable = 'comfortable'
}

export enum SidebarView {
  Project,
  Branches,
  'Changed Files',
  'Open Files'
}

export enum TreeSection {
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

// UiStore
class CUiStore {
  userStore: IUserStore = null;

  language: Language = Language.English;
  theme: string = 'vanilla-light';
  spacing: Spacing = Spacing.Cozy;
  pendingRequestCount: Map<SectionName, number> = new Map(
    Object.values(SectionName).map((sectionName) => [sectionName, 0])
  );
  isStickyWindow: boolean = false;

  // Sidebar
  sidebarView: SidebarView = null;
  sidebarWidth: number = null; // Last seen sidebar width, not 0 when sidebar is minimized
  isSidebarMinimized: boolean = false;

  // Tree Page
  isTreeSectionMinimized: {
    [TreeSection.OpenTabs]: TreeState;
    [TreeSection.Files]: TreeState;
  } = {
    [TreeSection.OpenTabs]: { isMinimized: false, lastHeight: 50 },
    [TreeSection.Files]: { isMinimized: false, lastHeight: 50 }
  };

  // Search Page
  isSearchSectionMinimized: boolean = true;
  selectedQuery: string = null;
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
