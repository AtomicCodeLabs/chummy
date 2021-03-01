import React, { useState } from 'react';

import EditionBox from '../boxes/EditionBox';
import ToggleSwitch from '../ToggleSwitch';
import usePrices from '../../hooks/usePrices';
import useUser from '../../hooks/useUser';

export const EditionsContainer = () => {
  const [isMonthly, setIsMonthly] = useState(true); // alternative is yearly
  const prices = usePrices();
  const user = useUser();

  console.log('USER', user);

  return (
    <>
      <ToggleSwitch
        leftText="Monthly"
        rightText="Yearly 25% OFF"
        isLeft={isMonthly}
        toggle={() => setIsMonthly(!isMonthly)}
        className="my-12"
      />
      <div className="grid content-center grid-cols-3 my-10 md:grid-cols-1 gap-7 sm:gap-6 -mx-7 sm:-mx-6 md:my-8 sm:my-6">
        {prices &&
          Object.entries(
            prices
          ).map(
            ([
              key,
              {
                title,
                description,
                monthlyPrice,
                yearlyPrice,
                features,
                Icon,
                unit
              }
            ]) => (
              <EditionBox
                key={key}
                title={title}
                description={description}
                price={isMonthly ? monthlyPrice : yearlyPrice}
                isMonthly={isMonthly}
                isFeatured={title === 'Professional'}
                features={features}
                Icon={Icon}
                unit={unit}
                customerId={user?.['custom:stripe_id']}
                userAccountType={user?.accountType}
                isTrial={user?.isTrial === 'true'}
                className="md:w-full md:mx-auto"
              />
            )
          )}
      </div>
    </>
  );
};

const EditionsSection = () => (
  <div className="sm:text-center">
    <h2>Choose your edition.</h2>
    <div>
      Start your 14-day trial included with all plans. No credit card required.
    </div>
    <EditionsContainer />
  </div>
);
export default EditionsSection;
