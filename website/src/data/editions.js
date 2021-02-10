import React from 'react';
import { CgDice1, CgDice2, CgDice3 } from 'react-icons/cg';

export default [
  {
    title: 'Community',
    description: 'All the core features to get you started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    Icon: <CgDice1 />,
    features: [
      'Core features:',
      'Repositories and tab management',
      'Track up to 10 open tabs at a time',
      'Powerful search tool',
      'Vanilla light theme',
      'Cozy spacing',
      'Private repositories',
      'Bookmarks search',
      'Bookmark up to 15 files'
    ]
  },
  {
    title: 'Professional',
    description: 'Unlimited everything + more features',
    monthlyPrice: 12,
    yearlyPrice: 9,
    Icon: <CgDice2 />,
    features: [
      'Everything in Community, plus:',
      'Unlimited bookmarks',
      'Unlimited tabs',
      'Zero, Dense, Cozy, and Comfortable spacing options',
      'Dark mode + more themes',
      'Sticky extension',
      'Priority Support'
    ]
  },
  {
    title: 'Enterprise',
    description: 'Professional for professionals',
    monthlyPrice: 12,
    yearlyPrice: 9,
    Icon: <CgDice3 />,
    features: [
      'Everything in Professional, plus:',
      'License management',
      'Github Enterprise integration',
      'Priority Support'
    ]
  }
];
