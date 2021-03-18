import React from 'react';
import { CgGlassAlt, CgCoffee } from 'react-icons/cg';
import { BiWine } from 'react-icons/bi';

export default {
  Community: {
    title: 'Community',
    nicknameId: { monthly: 'Community Free', yearly: 'Community Free' },
    description: 'All the core features to get you started',
    unit: '',
    Icon: <CgGlassAlt />,
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
    Icon: <CgCoffee />,
    features: [
      'Everything in Community, plus:',
      'Unlimited bookmarks',
      'Unlimited tabs',
      'Distraction free mode',
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
    unit: (
      <>
        /mo
        <br />
        /seat
      </>
    ),
    Icon: <BiWine />,
    features: [
      'Everything in Professional, plus:',
      // 'License management portal for teams',
      'Github Enterprise integration',
      'Priority Support'
    ]
  }
};
