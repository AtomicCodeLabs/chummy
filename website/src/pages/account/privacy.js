import React from 'react';

import SEO from '../../components/seo';
import AccountLayout from '../../components/layout/AccountLayout';

const Privacy = () => (
    <AccountLayout title={<h1 className="mb-10">Privacy</h1>}>
      <SEO title="Privacy" />
      <div className="h-px bg-gray-300" />
      <div className="flex flex-row items-center justify-between py-6">
        <div className="flex flex-col">
          <h4 className="font-medium mt-0 mb-2.5 text-gray-700">Edition</h4>
          <div className="text-sm text-gray-700 sm:text-xs">Professional</div>
        </div>
        <div className="text-sm text-green-600 sm:text-xs">Change</div>
      </div>
      <div className="h-px bg-gray-300" />
      <div className="flex flex-row items-center justify-between py-6">
        <div className="flex flex-col">
          <h4 className="font-medium mt-0 mb-2.5 text-gray-700">
            Github Email
          </h4>
          <div className="text-sm text-gray-700 sm:text-xs">
            alexgkim205@gmail.com
          </div>
        </div>
      </div>
      <div className="h-px bg-gray-300" />
    </AccountLayout>
  );
export default Privacy;
