import React, { cloneElement } from 'react';
import clsx from 'clsx';
import { CgCheck } from 'react-icons/cg';
import ActionButton from '../buttons/ActionButton';

const EditionBox = ({
  title,
  description,
  price,
  isMonthly,
  features,
  Icon,
  unit,
  className,
  isFeatured = false
}) => {
  const isCommunity = title === 'Community';

  return (
    <div
      className={clsx(
        'rounded-lg bg-gray-100 cursor-text sm:w-4/5 sm:items-center overflow-hidden',
        'text-center',
        {
          'shadow-lg': isFeatured,
          'border-2 border-gray-200': !isFeatured
        },
        className
      )}
      style={isFeatured ? { borderTop: '12px solid #34D399' } : {}}
    >
      <div
        className={clsx('flex flex-col px-7 pb-7 sm:py-6 sm:px-8 xs:px-6', {
          'pt-7': isFeatured,
          'pt-10': !isFeatured
        })}
      >
        <div className="self-center w-16 h-16 mt-6 mb-3 md:h-14 md:w-14 sm:h-12 sm:w-12">
          {cloneElement(Icon, { className: 'h-full w-full' })}
        </div>
        <h4 className="font-mono uppercase">{title}</h4>
        <p className="h-12 text-base text-gray-500 md:h-auto">{description}</p>
        <div className="flex flex-col items-center justify-start h-24 mt-8 text-center md:h-20">
          <div className="inline-flex flex-row justify-center text-gray-500">
            {isCommunity ? (
              <span className="text-5xl text-gray-900 md:text-4xl sm:text-3xl">
                Free
              </span>
            ) : (
              <>
                <div className="w-4">
                  <span className="text-xl text-gray-500 md:text-lg sm:text-md">
                    $
                  </span>
                </div>
                <span className="text-gray-900 text-7xl md:text-6xl sm:text-5xl">
                  {price}
                </span>
                <div className="flex items-end w-4">
                  <span className="text-xl text-gray-500 md:text-lg sm:text-md">
                    {unit}
                  </span>
                </div>
              </>
            )}
          </div>
          {!isCommunity && !isMonthly && (
            <span className="text-base text-gray-500 md:text-sm">
              billed annually
            </span>
          )}
        </div>
        <div className="flex h-20 mx-auto my-3">
          <ActionButton
            to="/signin"
            state={{ fromWebsite: true }}
            className="my-auto"
          >
            {title === 'Community'
              ? 'Download free'
              : 'Start 14-day free trial'}
          </ActionButton>
        </div>
      </div>
      {/* Features */}
      <div className="flex flex-col w-full h-full p-4 text-left bg-white border-t-2 border-gray-200">
        {features &&
          features.map((feature, i) => (
            <div
              key={feature}
              className={clsx('flex flex-row items-start p-1', {
                'font-bold mt-3 mb-2': i === 0
              })}
            >
              {i !== 0 && (
                <CgCheck className="w-6 h-6 text-green-500 fill-current" />
              )}{' '}
              <div className="flex-1 text-base">{feature}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default EditionBox;
