/* global chrome */
import { observable, computed } from 'mobx';
import { IRootStore } from './root.store';
import { EXTENSION_WIDTH } from '../../constants/sizes';
import { getFromChromeStorage, setInChromeStorage } from './util';

enum Language {
  English = 'en_US'
}
enum Theme {
  Light = 'light',
  Dark = 'dark'
}

enum SidebarView {
  Project,
  Branches,
  'Changed Files',
  'Open Files'
}

enum ExplorerSection {
  OpenFiles = 'openFiles',
  Files = 'files'
}

export interface IUiStore {
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
    [ExplorerSection.OpenFiles]: boolean;
    [ExplorerSection.Files]: boolean;
  };
}

export default class UiStore implements IUiStore {
  @observable language = Language.English;

  @observable theme = Theme.Light;

  @observable pendingRequestCount = 0;

  @observable sidebarView = SidebarView.Project;

  // Last seen sidebar width, not 0 when sidebar is minimized
  @observable sidebarWidth = EXTENSION_WIDTH.INITIAL;

  @observable isSidebarMinimized = false;

  @observable isTabbarMinimized = false;

  @observable isTreeSectionMinimized = {
    [ExplorerSection.OpenFiles]: false,
    [ExplorerSection.Files]: false
  };

  constructor(rootStore: IRootStore) {
    this.init();
  }

  @computed get appIsInSync() {
    return this.pendingRequestCount === 0;
  }

  init = () => {
    // Get and set previous sessions' settings
    const keys: string[] = [
      'language',
      'theme',
      'sidebarView',
      'sidebarWidth',
      'isSidebarMinimized'
    ];
    getFromChromeStorage(keys, (items: { [key: string]: any }) => {
      console.log('got items', items);
      if (items.language) this.language = items.language;
      if (items.theme) this.theme = items.theme;
      if (items.sidebarView) this.sidebarView = items.sidebarView;
      if (items.sidebarWidth) this.sidebarWidth = items.sidebarWidth;
      if (items.isSidebarMinimized)
        this.isSidebarMinimized = items.isSidebarMinimized;

      // Set defaults but don't overwrite previous
      setInChromeStorage({
        language: this.language,
        theme: this.theme,
        sidebarView: this.sidebarView,
        sidebarWidth: this.sidebarWidth,
        isSidebarMinimized: this.isSidebarMinimized
      });
    });
  };

  setTheme = (theme: Theme): void => {
    setInChromeStorage({ theme: theme });
    this.theme = theme;
  };

  toggleTheme = (): void => {
    this.setTheme(this.theme === Theme.Light ? Theme.Dark : Theme.Light);
  };

  setSidebarWidth = (width: number, setInChrome: boolean = false): void => {
    if (setInChrome) setInChromeStorage({ sidebarWidth: width });
    this.sidebarWidth = width;
  };

  openSidebar = () => {
    setInChromeStorage({ isSidebarMinimized: false });
    this.isSidebarMinimized = false;
  };

  closeSidebar = () => {
    setInChromeStorage({ isSidebarMinimized: true });
    this.isSidebarMinimized = true;
  };

  toggleTreeSection = (sectionName: ExplorerSection) => {
    console.log('SECTION', sectionName);
    this.isTreeSectionMinimized = {
      ...this.isTreeSectionMinimized,
      [sectionName]: !this.isTreeSectionMinimized[sectionName]
    };
  };
}
