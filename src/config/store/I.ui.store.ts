export enum Language {
  English = 'en_US'
}

export enum Theme {
  Light = 'light',
  Dark = 'dark'
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

export enum SectionName {
  Tree = 'Explorer',
  Search = 'Search',
  VCS = 'Source Control',
  Account = 'Account',
  Settings = 'Settings',
  None = 'None'
}

// UiStore
class CUiStore {
  language: Language = Language.English;
  theme: Theme = Theme.Light;
  spacing: Spacing = Spacing.Cozy;
  pendingRequestCount: number = 0;
  isPending: SectionName = SectionName.None;
  isStickyWindow: boolean = false; 

  // Sidebar
  sidebarView: SidebarView = null;
  sidebarWidth: number = null; // Last seen sidebar width, not 0 when sidebar is minimized
  isSidebarMinimized: boolean = false;

  // Tree Page
  isTreeSectionMinimized: {
    [TreeSection.OpenTabs]: boolean;
    [TreeSection.Files]: boolean;
  } = {
    [TreeSection.OpenTabs]: false,
    [TreeSection.Files]: false
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
