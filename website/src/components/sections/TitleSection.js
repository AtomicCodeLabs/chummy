import React from 'react';
import clsx from 'clsx';

const TitleSection = ({
  title = null,
  isCentered = false,
  children,
  className
}) => (
  <div
    className={clsx(
      'sm:text-center',
      {
        'py-2 my-14 md:my-12 sm:my-8': !className,
        'text-center': isCentered
      },
      className
    )}
  >
    {title}
    {children}
  </div>
);

export default TitleSection;
