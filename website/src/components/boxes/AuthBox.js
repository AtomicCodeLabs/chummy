import React, { cloneElement } from 'react';
import clsx from 'clsx';

const AuthBox = ({ className, title, Icon, children }) => (
    <div className={clsx('p-6 text-center', className)}>
      <div className="self-center w-16 h-16 mt-6 mb-3 md:h-14 md:w-14 sm:h-12 sm:w-12">
        {cloneElement(Icon, { className: 'h-full w-full' })}
      </div>
      <h2>{title}</h2>
      {children}
    </div>
  );

export default AuthBox;
