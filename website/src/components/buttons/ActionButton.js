import React from 'react';
import clsx from 'clsx';

import Link from '../Link';

const ActionButton = ({ children, className, ...linkProps }) => (
  <Link
    className={clsx(
      'bg-gray-900 text-white rounded-sm text-sm font-medium font-mono px-4 py-2',
      'relative transition-all top-0 hover:-top-1 hover:border-b-4 hover:border-white ',
      className
    )}
    {...linkProps}
  >
    {children}
  </Link>
);

export default ActionButton;
