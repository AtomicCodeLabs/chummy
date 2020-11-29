import { sidebarRoutes } from '../../config/routes';

export const getSidebarHeaderTitle = (pathname) => {
  return sidebarRoutes.find((r) => r.pathname === pathname)?.title || '';
};

// Certain pages are blocklisted, like account sign in, minimized, and pages
// behind feature flags
export const isPageWithHeader = (pathname) =>
  !['/account-sign-in', '/minimized', '/vcs'].includes(pathname);
