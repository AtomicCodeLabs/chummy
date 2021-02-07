import React from 'react';
import clsx from 'clsx';

const TitleSection = ({ title = null, children, className }) => (
  <div className={clsx('py-2 my-14 md:my-12 sm:my-8', className)}>
    <h2>{title}</h2>
    {children}
  </div>
);

export default TitleSection;
