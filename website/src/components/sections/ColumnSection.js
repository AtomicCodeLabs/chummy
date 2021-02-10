import React from 'react';
import clsx from 'clsx';

import TitleSection from './TitleSection';

/*
 * Places children into single column
 */
const ColumnSection = ({
  title,
  children,
  titleClassName,
  className,
  isCentered = false,
  colWidth = 12
}) => {
  const maxWidth = Math.min(colWidth, 12);
  return (
    <TitleSection
      title={title}
      className={titleClassName}
      isCentered={isCentered}
    >
      <div
        className={clsx(
          'flex flex-row',
          { 'justify-center': isCentered },
          className
        )}
      >
        <div
          className={clsx(
            'flex flex-col sm:w-full',
            `w-${maxWidth === 12 ? 'full' : `${maxWidth}/12`}`
          )}
        >
          {children}
        </div>
      </div>
    </TitleSection>
  );
};

export default ColumnSection;
