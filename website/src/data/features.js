import React from 'react';
import {
  CgBriefcase,
  CgSearch,
  CgTab,
  CgBookmark,
  CgDarkMode,
  CgUndo,
  CgStack,
  // CgNotes,
  // CgGitBranch,
  CgTimer
} from 'react-icons/cg';

export const features = [
  {
    features: [
      {
        Icon: <CgBriefcase />,
        title: 'Repository Management',
        description:
          'Unclutter your windows and tabs. Easily switch between multiple open repositories using the sidebar.'
      },
      {
        Icon: <CgTab />,
        title: 'Tabbed Files',
        description:
          'Keep organized while having multiple files open at once. You can manage all open files at any given time from one place.'
      },
      {
        Icon: <CgTab />,
        title: 'Project Tree',
        description:
          "Get to your files faster. Navigate repository files using the ergonomic file explorer that should've been included with Github."
      }
    ],
    image: 'full',
    image2: 'browser'
  },
  {
    features: [
      {
        Icon: <CgSearch />,
        title: 'Powerful Search',
        description:
          'Search for anything. Leverage Github’s powerful search API to search in code, by filename, by extension, and more.'
      }
    ],
    image: 'search'
  },
  {
    features: [
      {
        Icon: <CgBookmark />,
        title: 'Bookmarks',
        description:
          'Losing track of the files you’ve opened? Bookmark them so you can save and search for them later.'
      }
    ],
    image: 'bookmark'
  },
  {
    features: [
      {
        Icon: <CgDarkMode />,
        title: 'Custom Themes',
        description:
          'Choose between light and dark themes to match your style. Don’t see any you like? Contribute your own customized palette!'
      }
    ],
    image: 'theme'
  }
];

export const extraFeatures = [
  {
    Icon: <CgUndo />,
    title: 'Saved Sessions',
    description:
      'Pick up where you left off with saved sessions. Reopen the files and pages that are important to you with one click.'
  },
  {
    Icon: <CgStack />,
    title: 'Sticky Window',
    description:
      "Don't get lost in your windows! Always keep the extension visible and attached to your main window, wherever you click."
  },
  {
    Icon: <CgTimer />,
    title: 'Optimized Speed',
    description:
      'Browse quickly. Files are lazy loaded and cached at the folder level so that browsing even the largest repositories is a breeze!'
  }
  // {
  //   Icon: <CgNotes />,
  //   title: 'Scratchpad',
  //   description:
  //     'Need to stay organized? Take notes anywhere with the integrated scratchpad tool and save them for later.'
  // },
  // {
  //   Icon: <CgGitBranch />,
  //   title: 'Code Review',
  //   description:
  //     'Manage pull requests, track file changes, comments, approvals, and everything code review related from one place!'
  // }
];
