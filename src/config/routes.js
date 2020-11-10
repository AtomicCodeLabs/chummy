import React from 'react';
import {
  CodeIcon,
  SearchIcon,
  GitBranchIcon,
  BookmarkIcon,
  GearIcon,
  PersonIcon
} from '@primer/octicons-react';

import Tree from '../pages/Tree';
import Search from '../pages/Search';
import Vcs from '../pages/Vcs';
import Bookmarks from '../pages/Bookmarks';
import Account from '../pages/Account';
import AccountSignIn from '../pages/Account/SignIn';
import Settings from '../pages/Settings';

export const sidebarRoutes = [
  {
    pathname: '/',
    icon: <CodeIcon />,
    title: 'Explorer'
  },
  {
    pathname: '/search',
    icon: <SearchIcon />,
    title: 'Search'
  },
  {
    pathname: '/vcs',
    icon: <GitBranchIcon />,
    title: 'Source Control'
  },
  {
    pathname: '/bookmarks',
    icon: <BookmarkIcon />,
    title: 'Bookmarks'
  },
  {
    flex: true
  },
  {
    pathname: '/account',
    icon: <PersonIcon />,
    title: 'Account'
  },
  {
    pathname: '/settings',
    icon: <GearIcon />,
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
