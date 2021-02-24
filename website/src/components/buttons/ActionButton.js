import React from 'react';
import clsx from 'clsx';

import Link from '../Link';
import ButtonSpinner from '../spinners/ButtonSpinner';

const ActionButton = ({
  children,
  to,
  disabled = false,
  disabledFade = true,
  animated = true,
  isLoading = false,
  onClick,
  className,
  bgColor = 'bg-gray-900',
  textColor = 'text-white',
  ...props
}) => {
  const isLink = !!to; // if not, is button

  console.log('IS LOADING', isLoading);

  if (isLink) {
    return (
      <Link
        className={clsx(
          'rounded-sm text-sm sm:text-xs font-medium font-mono px-4 py-2 select-none',
          'relative transition-all top-0 hover:border-white',
          bgColor,
          textColor,
          {
            'hover:-top-1 hover:border-b-4 hover:border-white':
              !disabled && !isLoading && animated,
            'opacity-50': (disabled && disabledFade) || isLoading
          },
          className
        )}
        to={!isLoading && !disabled ? to : null}
        {...props}
      >
        <span className="inline-flex items-center">
          {children}
          <div
            className={clsx('', {
              'ml-3 block': isLoading,
              hidden: !isLoading
            })}
          >
            <ButtonSpinner />
          </div>
        </span>
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
          'hover:-top-1 hover:border-b-4 hover:border-white':
            !disabled && !isLoading && animated,
          'opacity-50': (disabled && disabledFade) || isLoading
        },
        className
      )}
      onClick={!isLoading && !disabled ? onClick : null}
      {...props}
    >
      <span className="inline-flex items-center">
        {children}
        <div
          className={clsx('', {
            'ml-3 block': isLoading,
            hidden: !isLoading
          })}
        >
          <ButtonSpinner />
        </div>
      </span>
    </div>
  );
};

export default ActionButton;
