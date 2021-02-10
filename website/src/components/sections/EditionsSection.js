import React, { useState } from 'react';

import EditionBox from '../boxes/EditionBox';
import ToggleSwitch from '../ToggleSwitch';
import editions from '../../data/editions';

const EditionsSection = () => {
  const [isMonthly, setIsMonthly] = useState(true); // alternative is yearly

  return (
    <div className="sm:text-center">
      <h2>Choose your edition.</h2>
      <div>Start your 14-day trial. No credit card required.</div>
      <ToggleSwitch
        leftText="Monthly"
        rightText="Yearly 25% OFF"
        isLeft={isMonthly}
        toggle={() => setIsMonthly(!isMonthly)}
        className="my-12"
      />
      <div className="grid content-center grid-cols-3 my-10 md:grid-cols-1 gap-7 sm:gap-6 -mx-7 sm:-mx-6 md:my-8 sm:my-6">
        {editions.map(
          ({
            title,
            description,
            monthlyPrice,
            yearlyPrice,
            features,
            Icon
          }) => (
            <EditionBox
              title={title}
              description={description}
              price={isMonthly ? monthlyPrice : yearlyPrice}
              isMonthly={isMonthly}
              isFeatured={title === 'Professional'}
              features={features}
              Icon={Icon}
              className="md:w-full md:mx-auto"
            />
          )
        )}
      </div>
    </div>
  );
};

export default EditionsSection;
