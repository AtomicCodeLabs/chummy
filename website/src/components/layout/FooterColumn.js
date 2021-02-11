import React from 'react';
import clsx from 'clsx';
import Link from '../Link';

const FooterColumn = ({ title, items, className }) => (
  <div className={clsx('flex flex-col mb-8', className)}>
    <h3 className="mt-0 font-mono font-normal text-gray-100">{title}</h3>
    {items &&
      items.map(({ name, pathname }) => (
        <Link
          key={name}
          className={clsx(
            'text-sm md:text-xs text-gray-400 transition-colors duration-75 hover:text-gray-100',
            'py-1'
          )}
          to={pathname}
        >
          {name}
        </Link>
      ))}
  </div>
);

export default FooterColumn;
