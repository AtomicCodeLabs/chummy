import React from 'react';
import {
  CodeIcon,
  SearchIcon,
  GitBranchIcon,
  BookmarkIcon,
  GearIcon,
  PersonIcon
} from '@primer/octicons-react';

import { IconWithFeatureFlag } from '../components/Icon';

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
  {
    pathname: '/vcs',
    icon: <IconWithFeatureFlag Icon={<GitBranchIcon size={22} />} />,
    title: 'Source Control'
  },
  {
    flex: true
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
