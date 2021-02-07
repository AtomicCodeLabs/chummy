import React from 'react';
import clsx from 'clsx';

import TitleSection from './TitleSection';

/*
 * > lg = 3 columns
 * > sm = 2 columns
 * < sm = 1 column
 */
const ResponsiveGridSection = ({
  title = null,
  children,
  className,
  hasTitleSection = true
}) => {
  const renderBody = () => (
    <div
      className={clsx(
        'grid grid-cols-3 md:grid-cols-2 xs:grid-cols-1',
        className
      )}
    >
      {children}
    </div>
  );

  if (hasTitleSection) {
    return <TitleSection title={title}>{renderBody()}</TitleSection>;
  }
  return <>{renderBody()}</>;
};
ResponsiveGridSection.propTypes = {};

export default ResponsiveGridSection;
