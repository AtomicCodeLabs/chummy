import React from 'react';
import clsx from 'clsx';

import Link from '../Link';

const ActionButton = ({ children, to, onClick, className, ...props }) => {
  const isLink = !!to; // if not, is button

  if (isLink) {
    return (
      <Link
        className={clsx(
          'bg-gray-900 text-white rounded-sm text-sm sm:text-xs font-medium font-mono px-4 py-2',
          'relative transition-all top-0 hover:-top-1 hover:border-b-4 hover:border-white ',
          className
        )}
        to={to}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // It's a button!
  return (
    <div
      onKeyDown={onClick}
      tabIndex={0}
      role="button"
      className={clsx(
        'bg-gray-900 text-white rounded-sm text-sm sm:text-xs font-medium font-mono px-4 py-2',
        'relative transition-all top-0 hover:-top-1 hover:border-b-4 hover:border-white focus:outline-none',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default ActionButton;
