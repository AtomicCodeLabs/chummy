import React from 'react';
import clsx from 'clsx';
import { ImageOneAndTwo } from './FeatureBox.helper';

const FeatureBox = ({ children, Image, Image2 = null, className }) => (
    <div
      className={clsx(
        'flex flex-row sm:flex-col-reverse transition-shadow duration-200 p-7 sm:p-6 rounded-lg',
        className
      )}
    >
      <div className="flex flex-col items-center justify-around w-1/3 md:w-1/2 sm:w-full">
        {children}
      </div>
      <div
        className={clsx(
          'flex items-center justify-center md:justify-end w-2/3 md:w-1/2 sm:w-full sm:justify-center sm:mb-6 sm:-mt-6'
        )}
      >
        {Image2 ? (
          <ImageOneAndTwo ImageOne={Image} ImageTwo={Image2} />
        ) : (
          <div className="w-3/5 overflow-hidden shadow-xl-center rounded-xl md:w-4/5 sm:w-4/5">
            {Image}
          </div>
        )}
      </div>
    </div>
  );

export default FeatureBox;
