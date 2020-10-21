/* global chrome */
import { observable, computed } from 'mobx';

import IUiStore, {
  Language,
  Theme,
  SidebarView,
  ExplorerSection,
  UiStorePropsArray,
  UiStoreKeys
} from './I.ui.store';
import { EXTENSION_WIDTH } from '../../constants/sizes';
import { getFromChromeStorage, setInChromeStorage } from './util';

export default class UiStore implements IUiStore {
  @observable language = Language.English;
  @observable theme = Theme.Light;
  @observable pendingRequestCount = 0;
  @observable sidebarView = SidebarView.Project;
  @observable sidebarWidth = EXTENSION_WIDTH.INITIAL;
  @observable isSidebarMinimized = false;
  @observable isTabbarMinimized = false;
  @observable isTreeSectionMinimized = {
    [ExplorerSection.OpenTabs]: false,
    [ExplorerSection.Files]: false
  };
  @observable isSearchSectionMinimized = true;
  @observable selectedQuery: string = null;
  @observable selectedOpenRepo: string = null;
  @observable selectedLanguage: string = null;

  constructor() {
    this.init();
  }

  // Initialize
  init = () => {
    // Get keys of IUiStore
    const keys: UiStorePropsArray = UiStoreKeys;

    // Get and set previous sessions' settings
    getFromChromeStorage(keys, (items: { [key: string]: any }) => {
      // Set each key
      keys.forEach((key) => {
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

  @computed get appIsInSync() {
    return this.pendingRequestCount === 0;
  }

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
    if (!this.isSidebarMinimized) return;
    setInChromeStorage({ isSidebarMinimized: false });
    this.isSidebarMinimized = false;
  };

  closeSidebar = () => {
    if (this.isSidebarMinimized) return;
    setInChromeStorage({ isSidebarMinimized: true });
    this.isSidebarMinimized = true;
  };

  toggleTreeSection = (sectionName: ExplorerSection) => {
    this.isTreeSectionMinimized = {
      ...this.isTreeSectionMinimized,
      [sectionName]: !this.isTreeSectionMinimized[sectionName]
    };
  };

  toggleSearchSection = () => {
    this.isSearchSectionMinimized = !this.isSearchSectionMinimized;
    setInChromeStorage({
      isSearchSectionMinimized: this.isSearchSectionMinimized
    });
  };

  setSelectedQuery = (selectedQuery: string) => {
    this.selectedQuery = selectedQuery;
  };

  setSelectedOpenRepo = (selectedOpenRepo: string) => {
    this.selectedOpenRepo = selectedOpenRepo;
  };

  setSelectedLanguage = (selectedLanguage: string) => {
    this.selectedLanguage = selectedLanguage;
  };
}
