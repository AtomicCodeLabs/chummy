import React, { cloneElement, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useWindowSize from '../../hooks/useWindowSize';

// eslint-disable-next-line import/prefer-default-export
export const ImageOneAndTwo = ({
  leftImages,
  image2Grid = [],
  image2MaxWidth = 1000
}) => {
  const image2Ref = useRef();
  const [maskWidth, setMaskWidth] = useState(100);
  const windowSize = useWindowSize(100);

  useEffect(() => {
    if (image2Ref?.current) {
      setMaskWidth(
        Math.min(
          windowSize.width -
            Math.floor(image2Ref.current.getBoundingClientRect().x),
          image2MaxWidth
        )
      );
    }
  }, [image2Ref?.current?.offsetLeft, windowSize.width]);

  const hasImage2Grid = image2Grid.length > 1;

  return (
    <div className="w-3/5 overflow-visible md:w-4/5 sm:w-4/5">
      <div className="relative">
        <div className="flex flex-col">
          {leftImages &&
            leftImages.map((LeftImage, i) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className={clsx('overflow-hidden shadow-xl-center rounded-xl', {
                  'mb-8 sm:mb-6': i !== leftImages.length - 1
                })}
              >
                {LeftImage}
              </div>
            ))}
        </div>
        <div
          ref={image2Ref}
          className={clsx('absolute inset-y-0 h-full md:hidden', {
            'w-full': hasImage2Grid
          })}
          style={{ marginLeft: 'calc(100% + 2rem)' }}
        >
          {!hasImage2Grid ? (
            <div
              className={clsx(
                'relative h-full overflow-hidden shadow-xl-center',
                {
                  'rounded-xl': maskWidth === image2MaxWidth,
                  'rounded-l-xl': maskWidth !== image2MaxWidth
                }
              )}
              style={{ width: maskWidth || 1000, maxWidth: image2MaxWidth }}
            >
              {cloneElement(image2Grid[0], {
                className: 'absolute inset-y-0 l-0 w-screen',
                style: { height: '100%', width: 'auto' },
                imgStyle: { objectFit: 'cover', objectPosition: 'left' }
              })}
              <div className="absolute inset-y-0 w-full h-full bg-black opacity-20" />
            </div>
          ) : (
            <div className="flex flex-col flex-wrap h-full">
              {image2Grid &&
                image2Grid.map((image2, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <React.Fragment key={i}>
                    {cloneElement(image2, {
                      className: clsx(
                        'absolute inset-y-0 l-0 w-full shadow-xl-center overflow-hidden rounded-xl',
                        {
                          'mb-8 sm:mb-6': i !== image2Grid.length - 1
                        }
                      ),
                      imgStyle: { objectFit: 'cover' }
                    })}
                  </React.Fragment>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
