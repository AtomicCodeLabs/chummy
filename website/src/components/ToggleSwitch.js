import React from 'react';
import clsx from 'clsx';

export default ({
  leftText,
  rightText,
  isLeft = true,
  toggle = () => {},
  className
}) => (
  <div
    role="button"
    tabIndex={0}
    className={clsx(
      'relative flex flex-row max-w-sm mx-auto text-center text-gray-500 bg-gray-300 rounded-full cursor-pointer select-none focus:outline-none',
      className
    )}
    onClick={toggle}
    onKeyDown={toggle}
  >
    <div
      className={clsx(
        'flex justify-center items-center z-10 w-1/2 px-4 py-4 text-sm font-bold bg-transparent',
        {
          'text-gray-800': isLeft
        }
      )}
    >
      {leftText}
    </div>
    <div
      className={clsx(
        'flex justify-center items-center z-10 w-1/2 px-4 py-4 text-sm font-bold bg-transparent',
        {
          'text-gray-800': !isLeft
        }
      )}
    >
      {rightText}
    </div>
    {/* Slider */}
    <div
      className={clsx(
        'transition-transform transform bg-green-400 absolute w-1/2 h-full inset-y-0 rounded-full shadow-md',
        {
          'translate-x-0': isLeft,
          'translate-x-full': !isLeft
        }
      )}
    />
  </div>
);
