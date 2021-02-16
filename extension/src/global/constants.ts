export enum ACCOUNT_TYPE {
  Community = 'community',
  Professional = 'professional',
  Enterprise = 'enterprise'
}

export enum SETTING_TYPE {
  Theme = 'theme',
  Spacing = 'spacing',
  StickyWindow = 'stickywindow',
  SidebarSide = 'sidebarside'
}

export enum SIDEBAR_SIDE {
  Left = 'left',
  Right = 'right'
}

export enum SPACING {
  Compact = 'compact',
  Cozy = 'cozy',
  Comfortable = 'comfortable'
}

export enum THROTTLING_OPERATION {
  CreateBookmark = 'createbookmark'
}

export enum SUBPAGES {
  Repository = 'repository',
  Issues = 'issues',
  Pulls = 'pulls',
  Actions = 'actions',
  Projects = 'projects',
  Wiki = 'wiki',
  Security = 'security',
  Pulse = 'pulse',
  Settings = 'settings'
}

export enum GLOBAL_SUBPAGES {
  GlobalSettings = 'settings',
  GlobalIssues = 'issues',
  GlobalPulls = 'pulls',
  GlobalMarketplace = 'marketplace',
  GlobalExplore = 'explore',
  GlobalNotifications = 'notifications'
}

export enum BROWSER_TYPE {
  Chrome = 'chrome',
  Firefox = 'firefox',
  Edge = 'edge',
  Safari = 'safari',
  Opera = 'opera',
  Brave = 'brave'
}

export const APP_URLS = {
  WEBSITE: {
    BASE: process.env.WEBSITE_BASE_URL,
    SIGNIN: 'signin/',
    REDIRECT: 'account/',
    TUTORIAL: 'tutorial/'
  }
};

export const DEFAULT_BRANCH = 'DEFAULT_BRANCH';

export const GITHUB_URLS = {
  SEARCH_QUERY:
    'https://docs.github.com/en/free-pro-team@latest/github/searching-for-information-on-github/searching-code',
  REPO_INDEXING:
    'https://github.blog/changelog/2020-12-17-changes-to-code-search-indexing/',
  FEEDBACK: 'https://github.com/alexkim205/chummy/issues/new/choose',
  MAIN_REPO: 'https://github.com/alexkim205/chummy'
};
