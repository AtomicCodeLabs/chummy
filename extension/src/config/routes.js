/* eslint-disable react/prop-types */
import React from 'react';
import loadable from '@loadable/component';
import {
  CodeIcon,
  SearchIcon,
  BookmarkIcon,
  GearIcon,
  PersonIcon,
  BellIcon
} from '@primer/octicons-react';

import AccountSignIn from '../pages/Account/SignIn'; // Don't lazy load this, because it's used as default error page
import CenterContainer from '../components/Containers/Center';

const LoadingPage = ({ error }) => {
  if (error) {
    return <AccountSignIn />;
  }
  return <CenterContainer />;
};

// Lazy load route pages
const Tree = loadable(() => import('../pages/Tree'), {
  fallback: <LoadingPage />
});
const Search = loadable(() => import('../pages/Search'), {
  fallback: <LoadingPage />
});
const Vcs = loadable(() => import('../pages/Vcs'), {
  fallback: <LoadingPage />
});
const Bookmarks = loadable(() => import('../pages/Bookmarks'), {
  fallback: <LoadingPage />
});
const Account = loadable(() => import('../pages/Account'), {
  fallback: <LoadingPage />
});
const Settings = loadable(() => import('../pages/Settings'), {
  fallback: <LoadingPage />
});

export const sidebarRoutes = [
  {
    pathname: '/',
    icon: <CodeIcon size={22} />,
    title: 'Explorer'
  },
  {
    pathname: '/search',
    icon: <SearchIcon size={22} />,
    title: 'Search'
  },
  {
    pathname: '/bookmarks',
    icon: <BookmarkIcon size={22} />,
    title: 'Bookmarks'
  },
  // {
  //   pathname: '/vcs',
  //   icon: <IconWithFeatureFlag Icon={<GitBranchIcon size={22} />} />,
  //   title: 'Source Control'
  // },
  {
    flex: true
  },
  {
    pathname: '/notifications',
    icon: <BellIcon size={22} />,
    title: 'Notifications'
  },
  {
    pathname: '/account',
    icon: <PersonIcon size={22} />,
    title: 'Account'
  },
  {
    pathname: '/settings',
    icon: <GearIcon size={22} />,
    title: 'Settings'
  }
];

export const routes = [
  {
    pathname: '/',
    component: <Tree />
  },
  {
    pathname: '/search',
    component: <Search />
  },
  {
    pathname: '/vcs',
    component: <Vcs />
  },
  {
    pathname: '/bookmarks',
    component: <Bookmarks />
  },
  {
    pathname: '/account',
    component: <Account />
  },
  {
    pathname: '/account-sign-in',
    component: <AccountSignIn />
  },
  {
    pathname: '/settings',
    component: <Settings />
  },
  {
    pathname: '/minimized',
    component: <></>
  }
];
