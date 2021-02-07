import React from 'react';
import clsx from 'clsx';

import Link from '../Link';

const NavItem = ({ isActive, children, to }) => (
  <Link
    to={to}
    className={clsx(
      'px-4',
      'py-2',
      'rounded-md',
      'text-sm',
      'font-medium',
      'font-mono',
      {
        'bg-transparent text-black': isActive,
        'text-gray-600 hover:text-black': !isActive
      }
    )}
  >
    {children}
  </Link>
);

export default NavItem;
