import React from 'react';
import { CgDice1, CgDice2, CgDice3 } from 'react-icons/cg';

export default {
  Community: {
    title: 'Community',
    nicknameId: { monthly: 'Community Free', yearly: 'Community Free' },
    description: 'All the core features to get you started',
    unit: '',
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
      'Bookmark up to 15 files',
      'Account portal'
    ]
  },
  Professional: {
    title: 'Professional',
    nicknameId: {
      monthly: 'Professional Monthly',
      yearly: 'Professional Yearly'
    },
    description: 'Unlimited everything + more features',
    unit: '/mo',
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
  Enterprise: {
    title: 'Enterprise',
    nicknameId: {
      monthly: 'Enterprise Monthly',
      yearly: 'Enterprise Yearly'
    },
    metadataId: {
      monthly: 'monthly_unit_amount',
      yearly: 'yearly_unit_amount'
    },
    description: 'Professional licenses for teams of 5+',
    unit: '/mo/seat',
    Icon: <CgDice3 />,
    features: [
      'Everything in Professional, plus:',
      'License management portal for teams',
      'Github Enterprise integration',
      'Priority Support'
    ]
  }
};
