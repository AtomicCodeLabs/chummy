export enum Language {
  English = 'en_US'
}

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

export enum SidebarView {
  Project,
  Branches,
  'Changed Files',
  'Open Files'
}

export enum ExplorerSection {
  OpenTabs = 'openTabs',
  Files = 'files'
}

// UiStore
class CUiStore {
  language: Language = Language.English;
  theme: Theme = Theme.Light;
  pendingRequestCount: number = 0;

  // Sidebar
  sidebarView: SidebarView = null;
  sidebarWidth: number = null; // Last seen sidebar width, not 0 when sidebar is minimized
  isSidebarMinimized: boolean = false;

  // Tree Page
  isTreeSectionMinimized: {
    [ExplorerSection.OpenTabs]: boolean;
    [ExplorerSection.Files]: boolean;
  } = {
    [ExplorerSection.OpenTabs]: false,
    [ExplorerSection.Files]: false
  };

  // Search Page
  isSearchSectionMinimized: boolean = false;
  selectedQuery: string = null;
  selectedOpenRepo: string = null;
  selectedLanguage: string = null;
}

export default interface IUiStore extends CUiStore {}

export type UiStorePropsArray = Array<keyof IUiStore>;

export const UiStoreKeys = Object.keys(new CUiStore()) as UiStorePropsArray;
