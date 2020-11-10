import { sidebarRoutes } from '../../config/routes';

export const getSidebarHeaderTitle = (pathname) => {
  return sidebarRoutes.find((r) => r.pathname === pathname)?.title || '';
};

export const isPageWithHeader = (pathname) =>
  !['/account-sign-in', '/minimized'].includes(pathname);
