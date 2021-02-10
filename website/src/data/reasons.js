import React from 'react';
import {
  CgBolt,
  CgArrowsExchange,
  CgExtension,
  CgBandAid,
  CgCheckO,
  CgLockUnlock
} from 'react-icons/cg';

const reasons = [
  {
    Icon: <CgBolt />,
    title: 'One Click Setup',
    description:
      'Use your existing Github account to get started. No extra configuration, no sign up, no credit card required. '
  },
  {
    Icon: <CgArrowsExchange />,
    title: 'Cross Browser Compatible',
    description:
      'Available on Chrome, Firefox, Opera, Edge and all Chromium-based browsers. Support Safari coming to you soon!'
  },
  {
    Icon: <CgExtension />,
    title: 'Simple & Flexible',
    description:
      'One extension. Many ways to use it. A simple and clean user experience makes the app a joy to use. '
  },
  {
    Icon: <CgBandAid />,
    title: 'Zero Hassle Cancellation',
    description:
      "Unsatisfied with your premium account? We’ll cancel your subscription, no questions asked. We're here to make your life easier, not harder."
  },
  {
    Icon: <CgCheckO />,
    title: 'No Tracking',
    description:
      'Chummy does not (and will never!) track, store, or sell your private information in any shape or form. See our privacy page for more detail.'
  },
  {
    Icon: <CgLockUnlock />,
    title: 'Open Source',
    description:
      'No funny business here! The entire codebase is open source, and undergoes security auditing before each release.'
  }
];

export default reasons;