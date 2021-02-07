import React from 'react';
import clsx from 'clsx';

export default ({ children, className }) => (
  <div
    className={clsx(
      'box-border flex flex-col max-w-6xl mx-auto w-full p-14 flex-nowrap sm:p-12',
      className
    )}
  >
    {children}
  </div>
);
