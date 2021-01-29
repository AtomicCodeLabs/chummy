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
    SIGNIN: process.env.WEBSITE_SIGNIN,
    REDIRECT: process.env.WEBSITE_REDIRECT
  }
};

export const DEFAULT_BRANCH = 'DEFAULT_BRANCH';
