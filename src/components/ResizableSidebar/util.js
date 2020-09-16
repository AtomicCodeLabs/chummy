export const getSidebarHeaderTitle = (pathname) => {
  switch (pathname) {
    case '/':
      return 'Explorer';
    case '/search':
      return 'Search';
    case '/vcs':
      return 'Source Control';
    case '/account':
      return 'Account';
    case '/settings':
      return 'Settings';
    default:
      return '';
  }
};

export const isPageWithHeader = (pathname) =>
  !['/account-sign-in', '/minimized'].includes(pathname);
