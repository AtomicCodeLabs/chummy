import React from 'react';
import { CgExternal } from 'react-icons/cg';

import SEO from '../../components/seo';
import AccountLayout from '../../components/layout/AccountLayout';
import { BulletsSection } from '../../components/sections/AccountSection';

const ButtonText = ({ children }) => (
  <span className="inline-flex items-center">
    {children} <CgExternal className="w-5 h-5 ml-1.5" />
  </span>
);

const Feedback = () => (
  <AccountLayout title={<h2 className="mb-10">Feedback</h2>}>
    <SEO title="Account - Feedback" />
    <div className="pb-6 text-base font-light text-gray-700 sm:text-sm">
      Thank you for choosing to leave feedback! Your feedback plays such an
      important role in making our product better for you.
    </div>
    <BulletsSection
      title="What's on your mind?"
      options={[
        {
          label: 'I have a feature request.',
          value: ['feature', false],
          buttonText: <ButtonText>Open an issue on GitHub</ButtonText>
        },
        {
          label: 'I spy a bug.',
          value: ['bug', false],
          buttonText: <ButtonText>Open an issue on GitHub</ButtonText>
        },
        {
          label: 'I have a general question.',
          value: ['general', false],
          buttonText: <ButtonText>Start a conversation on GitHub</ButtonText>
        },
        {
          label: 'I have a question about my subscription.',
          value: ['question', false],
          buttonText: <ButtonText>Send us an email</ButtonText>
        }
      ]}
      buttonText="Submit"
      onSubmit={async ([selectedOption]) => {
        if (selectedOption === 'feature') {
          const win = window.open(
            'https://github.com/AtomicCodeLabs/chummy/issues/new?assignees=&labels=feature-request&template=feature-request.md&title=%5BFEAT%5D+',
            '_blank'
          );
          win.focus();
        }
        if (selectedOption === 'bug') {
          const win = window.open(
            'https://github.com/AtomicCodeLabs/chummy/issues/new?assignees=&labels=bug-report&template=bug.md&title=%5BBUG%5D+',
            '_blank'
          );
          win.focus();
        }
        if (selectedOption === 'general') {
          const win = window.open(
            'https://github.com/AtomicCodeLabs/chummy/discussions',
            '_blank'
          );
          win.focus();
        }
        if (selectedOption === 'question') {
          window.location.href = 'mailto:alexatatomiccode@gmail.com';
          // const win = window.open(
          //   'https://github.com/AtomicCodeLabs/chummy/issues/new?assignees=&labels=question&template=question.md&title=%5BQ%5D+',
          //   '_blank'
          // );
          // win.focus();
        }
      }}
      hasTopBorder
    />
  </AccountLayout>
);
export default Feedback;
