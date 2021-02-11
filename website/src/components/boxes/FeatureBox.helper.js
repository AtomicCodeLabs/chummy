import React, { cloneElement, useEffect, useRef, useState } from 'react';
import useWindowSize from '../../hooks/useWindowSize';

// eslint-disable-next-line import/prefer-default-export
export const ImageOneAndTwo = ({ ImageOne, ImageTwo }) => {
  const image2Ref = useRef();
  const [maskWidth, setMaskWidth] = useState(100);
  const windowSize = useWindowSize(100);

  useEffect(() => {
    if (image2Ref?.current) {
      setMaskWidth(
        windowSize.width -
          Math.floor(image2Ref.current.getBoundingClientRect().x)
      );
    }
  }, [image2Ref?.current?.offsetLeft, windowSize.width]);

  return (
    <div className="w-3/5 overflow-visible md:w-4/5 sm:w-4/5">
      <div className="relative">
        <div className="overflow-hidden shadow-xl-center rounded-xl">
          {ImageOne}
        </div>
        <div
          ref={image2Ref}
          className="absolute inset-y-0 h-full md:hidden"
          style={{ marginLeft: 'calc(100% + 2rem)' }}
        >
          <div
            className="relative h-full overflow-hidden shadow-xl-center rounded-l-xl"
            style={{ width: maskWidth || 500 }}
          >
            {cloneElement(ImageTwo, {
              className: 'absolute inset-y-0 l-0 w-screen',
              style: { height: '100%', width: 'auto' },
              imgStyle: { objectFit: 'cover', objectPosition: 'left' }
            })}
            <div className="absolute inset-y-0 w-full h-full bg-black opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
};
