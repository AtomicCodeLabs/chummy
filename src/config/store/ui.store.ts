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

export interface IUiStore {
  language: Language;
  theme: Theme;
  pendingRequestCount: number;

  // Sidebar
  sidebarView: SidebarView;
  sidebarWidth: number;
  isSidebarMinimized: boolean;
}

export default class UiStore implements IUiStore {
  @observable language = Language.English;

  @observable theme = Theme.Light;

  @observable pendingRequestCount = 0;

  @observable sidebarView = SidebarView.Project;

  @observable sidebarWidth = EXTENSION_WIDTH.INITIAL;

  @observable isSidebarMinimized = false;

  constructor(rootStore: IRootStore) {
    this.init();
  }

  @computed get appIsInSync() {
    return this.pendingRequestCount === 0;
  }

  init = () => {
    // Get and set previous sessions' settings
    const keys: string[] = ['language', 'theme', 'sidebarView', 'sidebarWidth'];
    getFromChromeStorage(keys, (items: { [key: string]: any }) => {
      console.log('got items', items);
      if (items.language) this.language = items.language;
      if (items.theme) this.theme = items.theme;
      if (items.sidebarView) this.sidebarView = items.sidebarView;
      if (items.sidebarWidth) this.sidebarWidth = items.sidebarWidth;

      // Set defaults but don't overwrite previous
      setInChromeStorage({
        language: this.language,
        theme: this.theme,
        sidebarView: this.sidebarView,
        sidebarWidth: this.sidebarWidth
      });
      chrome.storage.sync.get(null, function callback(items) {
        console.log(items);
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

  setSidebarWidth = (width: number): void => {
    setInChromeStorage({ sidebarWidth: width });
    this.sidebarWidth = width;
  };

  toggleSidebar = () => {
    this.isSidebarMinimized = !this.isSidebarMinimized;
  };
}
