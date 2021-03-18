import React from 'react';
import clsx from 'clsx';
import { ImageOneAndTwo } from './FeatureBox.helper';

const FeatureBox = ({
  children,
  leftImages = [], // Column of main images
  image2Grid = [], // Large image(s) to the right of the main image. Will disappear on resize
  ImageRight = null, // Image immediately to the right of the feature
  image2MaxWidth = 1000,
  className,
  isColumn = false
}) => {
  const hasImage2 = image2Grid.length !== 0;
  return (
    <div
      className={clsx(
        'flex sm:flex-col-reverse transition-shadow duration-200 p-7 sm:p-6 rounded-lg',
        { 'flex-row': !isColumn, 'flex-col': isColumn },
        className
      )}
    >
      <div
        className={clsx('flex items-center justify-around', {
          'w-full flex-row sm:flex-col-reverse': ImageRight && isColumn,
          'w-1/3 md:w-1/2 sm:w-full flex-col': !(ImageRight && isColumn)
        })}
      >
        <div
          className={clsx('sm:flex sm:flex-col sm:items-center', {
            'w-1/3 md:w-1/2 sm:w-full': ImageRight && isColumn,
            'w-full': !(ImageRight && isColumn)
          })}
        >
          {children}
        </div>
        {ImageRight && (
          <div className="flex justify-end w-2/3 md:w-1/2 sm:w-4/5">
            <div className="w-3/5 overflow-hidden shadow-xl-center rounded-xl md:w-4/5 sm:w-full sm:mb-6">
              {ImageRight}
            </div>
          </div>
        )}
      </div>
      <div
        className={clsx(
          'flex items-center md:justify-end sm:justify-center sm:mb-6 sm:-mt-6',
          { 'justify-end': !hasImage2, 'justify-center': hasImage2 },
          {
            'w-2/3 md:w-1/2 sm:w-full': !isColumn,
            'w-full': isColumn
          }
        )}
      >
        {hasImage2 ? (
          <ImageOneAndTwo
            leftImages={leftImages}
            image2Grid={image2Grid}
            image2MaxWidth={image2MaxWidth}
          />
        ) : (
          <div className="flex flex-col items-end w-full sm:items-center">
            {leftImages &&
              leftImages.map((LeftImage, i) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  className={clsx(
                    'overflow-hidden shadow-xl-center rounded-xl',
                    { 'mb-14 sm:mb-12': i !== leftImages.length - 1 },
                    {
                      'w-3/5 md:w-4/5 sm:w-4/5': !isColumn,
                      'w-full sm:w-4/5 mt-7 sm:mt-0': isColumn
                    }
                  )}
                >
                  {LeftImage}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureBox;
