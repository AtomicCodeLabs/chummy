import React from 'react';
import clsx from 'clsx';

import Link from '../Link';

const ActionButton = ({
  children,
  to,
  disabled = false,
  onClick,
  className,
  ...props
}) => {
  const isLink = !!to; // if not, is button

  if (isLink) {
    return (
      <Link
        className={clsx(
          'bg-gray-900 text-white rounded-sm text-sm sm:text-xs font-medium font-mono px-4 py-2 select-none',
          'relative transition-all top-0 hover:border-white',
          {
            'hover:-top-1 hover:border-b-4 hover:border-white': !disabled,
            'opacity-50': disabled
          },
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
        'bg-gray-900 text-white rounded-sm text-sm sm:text-xs font-medium font-mono px-4 py-2 select-none',
        'relative transition-all top-0 focus:outline-none',
        {
          'hover:-top-1 hover:border-b-4 hover:border-white': !disabled,
          'opacity-50': disabled
        },
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
