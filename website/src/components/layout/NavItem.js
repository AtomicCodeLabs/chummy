import React from 'react';
import clsx from 'clsx';

import Link from '../Link';

const NavItem = ({ isActive, children, to, isMobile = false, className }) => (
  <Link
    to={to}
    className={clsx('font-medium font-mono text-sm', className, {
      'bg-transparent text-black': isActive,
      'text-gray-600 hover:text-black': !isActive,
      'rounded-md': !isMobile,
      'transition-colors	hover:bg-gray-100': isMobile
    })}
  >
    {children}
  </Link>
);

export default NavItem;
