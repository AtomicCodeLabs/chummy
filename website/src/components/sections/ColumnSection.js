import React from 'react';
import clsx from 'clsx';

import TitleSection from './TitleSection';

/*
 * Places children into single column
 */
const ColumnSection = ({ title, children, className, colWidth = 12 }) => {
  const maxWidth = Math.min(colWidth + 2, 12);
  return (
    <TitleSection title={title} className={className}>
      <div className="flex flex-row">
        <div
          className={clsx(
            'flex flex-col sm:w-full',
            `md:w-${maxWidth === 12 ? 'full' : `${maxWidth}/12`}`,
            `w-${maxWidth === 12 ? 'full' : `${maxWidth}/12`}`
          )}
        >
          {children}
        </div>
        <div
          className={clsx(
            'sm:w-0',
            `md:w-${12 - maxWidth === 0 ? '0' : `${12 - maxWidth}/12`}`,
            `w-${12 - maxWidth === 0 ? '0' : `${12 - maxWidth}/12`}`
          )}
        />
      </div>
    </TitleSection>
  );
};

export default ColumnSection;
