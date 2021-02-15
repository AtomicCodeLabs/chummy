import React from 'react';
import { CgExternal } from 'react-icons/cg';

import SEO from '../../components/seo';
import AccountLayout from '../../components/layout/AccountLayout';
import { BulletsSection } from '../../components/sections/AccountSection';
import useUser from '../../hooks/useUser';

const Feedback = () => {
  const user = useUser();
  console.log('Feedback', user);

  return (
    <AccountLayout title={<h2 className="mb-10">Feedback</h2>}>
      <SEO title="Privacy" />
      <div className="pb-6 text-base font-light text-gray-700 sm:text-sm">
        Thank you for choosing to leave feedback! Your feedback plays such an
        important role in making our product better for you.
      </div>
      <BulletsSection
        title="Manage your personal data"
        options={[
          {
            label: 'I have a feature request.',
            value: ['feature', false]
          },
          {
            label: 'I spy a bug.',
            value: ['bug', false]
          },
          {
            label: 'I have some general feedback.',
            value: ['general', false]
          },
          {
            label: 'I have a question.',
            value: ['question', false]
          }
        ]}
        buttonText={
          <span className="inline-flex items-center">
            Open an issue on Github <CgExternal className="w-5 h-5 ml-1.5" />
          </span>
        }
        onSubmit={async ([selectedOption]) => {
          if (selectedOption === 'feature') {
            const win = window.open(
              'https://github.com/alexkim205/chummy/issues/new?assignees=&labels=feature-request&template=feature-request.md&title=%5BFEAT%5D+',
              '_blank'
            );
            win.focus();
          }
          if (selectedOption === 'bug') {
            const win = window.open(
              'https://github.com/alexkim205/chummy/issues/new?assignees=&labels=bug-report&template=bug.md&title=%5BBUG%5D+',
              '_blank'
            );
            win.focus();
          }
          if (selectedOption === 'general') {
            const win = window.open(
              'https://github.com/alexkim205/chummy/issues/new',
              '_blank'
            );
            win.focus();
          }
          if (selectedOption === 'question') {
            const win = window.open(
              'https://github.com/alexkim205/chummy/issues/new?assignees=&labels=question&template=question.md&title=%5BQ%5D+',
              '_blank'
            );
            win.focus();
          }
        }}
        hasTopBorder
      />
    </AccountLayout>
  );
};
export default Feedback;
