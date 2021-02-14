import React from 'react';

import SEO from '../../components/seo';
import AccountLayout from '../../components/layout/AccountLayout';
import { BulletsSection } from '../../components/sections/AccountSection';
// import useUser from '../../hooks/useUser';

const Privacy = () => {
  // const user = useUser();
  console.log('placeholder');

  return (
    <AccountLayout title={<h2 className="mb-10">Privacy</h2>}>
      <SEO title="Privacy" />
      <div className="pb-6 text-base font-light text-gray-700 sm:text-sm">
        We collect the bare essential data points like your email address,
        account type, and other non-sensitive information, to learn about how
        you use Chummy best.
      </div>
      <BulletsSection
        title="Manage your personal data"
        options={[
          {
            label: 'Download a copy of all personal data in your account.',
            value: 'download'
          },
          {
            label: 'Delete your account and personal data.',
            value: 'delete'
          }
        ]}
        buttonText="Request"
        hasTopBorder
        hasBottomBorder
      />
      <BulletsSection
        type="checkbox"
        title="Manage your communications"
        options={[
          {
            label:
              'Keep me updated with the latest releases via email. We’ll send an email only when major versions are released.',
            value: 'download'
          }
        ]}
        hasBottomBorder
        buttonText="Save"
      />
    </AccountLayout>
  );
};
export default Privacy;
