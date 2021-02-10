import React, { cloneElement } from 'react';
import clsx from 'clsx';

const ReasonBox = ({ Icon, title, description, className }) => (
  <div
    className={clsx(
      'flex flex-col transition-shadow duration-200 rounded-lg cursor-text p-7 sm:py-6 sm:px-8 xs:px-6 sm:w-4/5 sm:items-center',
      'border-2 border-gray-300 border-opacity-0 hover:border-opacity-100',
      'hover:shadow-lg',
      'sm:text-center',
      className
    )}
  >
    <div className="sm:self-center w-14 h-14 md:h-12 md:w-12 sm:h-10 sm:w-10">
      {cloneElement(Icon, { className: 'h-full w-full' })}
    </div>
    <h4 className="font-mono">{title}</h4>
    <p className="text-gray-500">{description}</p>
  </div>
);

export default ReasonBox;
