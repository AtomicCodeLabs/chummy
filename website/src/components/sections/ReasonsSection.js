import React from 'react';

import ResponsiveGridSection from './ReponsiveGridSection';
import ReasonBox from '../boxes/ReasonBox';
import reasons from '../../data/reasons';

const ReasonsSection = () => (
  <ResponsiveGridSection
    title={<>Why use Chummy?</>}
    className="my-10 -mx-7 sm:-mx-6 md:my-8 sm:my-6"
  >
    {reasons.map(({ Icon, title, description }) => (
      <ReasonBox
        key={title}
        Icon={Icon}
        title={title}
        description={description}
      />
    ))}
  </ResponsiveGridSection>
);

export default ReasonsSection;
