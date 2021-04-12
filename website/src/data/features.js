import React from 'react';
import {
  CgBriefcase,
  CgSearch,
  CgTab,
  CgBookmark,
  CgDarkMode,
  CgUndo,
  CgStack,
  CgArrowsMergeAltV,
  CgListTree,
  CgAssign,
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
        Icon: <CgListTree />,
        title: 'Project Tree',
        description:
          "Get to your files faster. Navigate repository files using the ergonomic file explorer that should've been included with GitHub."
      }
    ],
    leftImages: ['full'],
    image2Grid: ['browser']
  },
  {
    features: [
      {
        Icon: <CgSearch />,
        title: 'Powerful Search',
        description:
          'Search for anything. Leverage GitHub’s powerful search API to search in code, by filename, by extension, and more.'
      }
    ],
    leftImages: ['search']
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
    leftImages: ['bookmark']
  },
  {
    features: [
      {
        Icon: <CgAssign />,
        title: 'Distraction Free Mode',
        description:
          'Unclutter your space and maximize focus. Bringing your favorite IDE feature to you.'
      }
    ],
    leftImages: ['distraction'],
    imageRight: 'distractionExtension',
    isColumn: true
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
    leftImages: ['theme_vanilla_dark', 'theme_material_light', 'theme_dracula'],
    image2Grid: ['theme_jane', 'theme_monokai', 'theme_vanilla_light']
  }
];

export const extraFeatures = [
  {
    features: [
      {
        Icon: <CgUndo />,
        title: 'Saved Sessions',
        description:
          'Pick up where you left off with saved sessions. Reopen the files and pages that are important to you with one click.'
      }
    ]
  },
  {
    features: [
      {
        Icon: <CgStack />,
        title: 'Sticky Window',
        description:
          "Don't get lost in your windows! Always keep the extension visible and attached to your main window, wherever you click."
      }
    ]
  },
  {
    features: [
      {
        Icon: <CgTimer />,
        title: 'Optimized Speed',
        description:
          'Browse quickly. Files are lazy loaded and cached at the folder level so that browsing even the largest repositories is a breeze!'
      }
    ]
  },
  {
    features: [
      {
        Icon: <CgArrowsMergeAltV />,
        title: 'Quick Collapse',
        description:
          'Collapse all open folders to get back to the root of your repository.'
      }
    ]
  }
  // {
  //   Icon: <CgGitBranch />,
  //   title: 'Code Review',
  //   description:
  //     'Manage pull requests, track file changes, comments, approvals, and everything code review related from one place!'
  // }
];
