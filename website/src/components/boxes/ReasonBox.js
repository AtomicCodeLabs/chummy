import React, { cloneElement } from 'react';
import clsx from 'clsx';

const ReasonBox = ({ Icon, title, description, className }) => (
  <div
    className={clsx(
      'flex flex-col transition-shadow duration-200 rounded-lg cursor-pointer p-7 sm:p-6',
      'border-2 border-gray-300 border-opacity-0 hover:border-opacity-100',
      'hover:shadow-lg',
      'sm:text-center',
      className
    )}
  >
    <div className="sm:self-center w-14 h-14 md:h-12 md:w-12 sm:h-10 sm:w-10">
      {cloneElement(Icon, { className: 'h-full w-full' })}
    </div>
    <h3 className="font-mono">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

export default ReasonBox;
