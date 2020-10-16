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

export default interface IUiStore {
  language: Language;
  theme: Theme;
  pendingRequestCount: number;

  // Sidebar
  sidebarView: SidebarView;
  sidebarWidth: number;
  isSidebarMinimized: boolean;

  // Tabbar
  isTabbarMinimized: boolean;

  // Tree Page
  isTreeSectionMinimized: {
    [ExplorerSection.OpenTabs]: boolean;
    [ExplorerSection.Files]: boolean;
  };
}
