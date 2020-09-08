import { observable, computed } from 'mobx';
import { IRootStore } from './root.store';

enum Language {
  English = 'en_US'
}
enum Theme {
  Light,
  Dark
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
  sidebarView: SidebarView;
}

export default class UiStore implements IUiStore {
  @observable language = Language.English;

  @observable theme = Theme.Light;

  @observable pendingRequestCount = 0;

  @observable sidebarView = SidebarView.Project;

  constructor(rootStore: IRootStore) {}

  @computed get appIsInSync() {
    return this.pendingRequestCount === 0;
  }
}
