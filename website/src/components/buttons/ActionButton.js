import React from 'react';
import clsx from 'clsx';

import Link from '../Link';

const ActionButton = ({
  children,
  to,
  disabled = false,
  onClick,
  className,
  bgColor = 'bg-gray-900',
  textColor = 'text-white',
  ...props
}) => {
  const isLink = !!to; // if not, is button

  if (isLink) {
    return (
      <Link
        className={clsx(
          'rounded-sm text-sm sm:text-xs font-medium font-mono px-4 py-2 select-none',
          'relative transition-all top-0 hover:border-white',
          bgColor,
          textColor,
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
        'rounded-sm text-sm sm:text-xs font-medium font-mono px-4 py-2 select-none',
        'relative transition-all top-0 focus:outline-none',
        bgColor,
        textColor,
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
