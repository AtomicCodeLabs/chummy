import React, { cloneElement } from 'react';
import clsx from 'clsx';

const AuthBox = ({ className, title, Icon, children }) => {
  const { className: iconClassName } = Icon.props;
  return (
    <div
      className={clsx(
        'py-10 px-10 md:py-10 md:px-8 sm:px-8 text-center',
        className
      )}
    >
      <div className="self-center w-12 mt-8 mb-3 md:w-10 md:mb-0 md:mt-8 sm:w-8 sm:mt-6">
        {cloneElement(Icon, {
          className: clsx('h-full w-full', iconClassName)
        })}
      </div>
      {title}
      {children}
    </div>
  );
};

export default AuthBox;
