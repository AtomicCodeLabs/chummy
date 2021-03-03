import React, { useState } from 'react';
import { API } from 'aws-amplify';

import SEO from '../../components/seo';
import AccountLayout from '../../components/layout/AccountLayout';
import { BulletsSection } from '../../components/sections/AccountSection';
import useUser from '../../hooks/useUser';
import useToaster from '../../hooks/useToaster';
import sendEmail from '../../config/email';
import { updateUser } from '../../graphql/mutations';

const Privacy = () => {
  const user = useUser({ isPublic: false });
  const { createToast } = useToaster();
  const [emailButtonDisabled, setEmailDisabled] = useState({
    download: false,
    delete: false
  });

  const sendRequest = async (params) => {
    const response = await sendEmail(params);
    if (response.status === 200) {
      return params;
    }
    return null;
  };

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
            value: ['download', false]
          },
          {
            label: 'Delete your account and personal data.',
            value: ['delete', false]
          }
        ]}
        buttonText="Make a request"
        disabledButtonText="Already requested"
        onSubmit={async ([selectedOption]) => {
          // For now use emailjs service
          if (selectedOption === 'download') {
            const sent = await sendRequest({
              action: 'download-privacy-data',
              user: JSON.stringify(user)
            });
            if (sent) {
              createToast(
                'success',
                'Information request submitted',
                "You'll receive an email in 3-5 business days."
              );
              // Can't send same request again
              setEmailDisabled({
                ...emailButtonDisabled,
                [selectedOption]: true
              });
            } else {
              createToast(
                'error',
                'Information request error',
                'There was an error with your information request. Please try again.'
              );
            }
            // lambdaApi(`chummyCustomRequest-${process.env.STAGE}`, {
            //   data: { request: 'download-privacy-data', user }
            // });
          }
          if (selectedOption === 'delete') {
            const sent = await sendRequest({
              action: 'delete-user',
              user: JSON.stringify(user)
            });
            if (sent) {
              createToast(
                'success',
                'Delete request submitted',
                'Your request will be processed in 3-5 business days.'
              );
              // Can't send same request again
              setEmailDisabled({
                ...emailButtonDisabled,
                [selectedOption]: true
              });
            } else {
              createToast(
                'error',
                'Delete request error',
                'There was an error with your delete request. Please try again.'
              );
            }
          }
        }}
        hasTopBorder
        hasBottomBorder
        isButtonDisabled={([selectedOption]) =>
          emailButtonDisabled[selectedOption]
        }
      />
      <BulletsSection
        type="checkbox"
        title="Manage your communications"
        options={[
          {
            label:
              "Keep me updated with the latest releases via email. We don't spam!",
            value: ['email', user?.onMailingList === 'true']
          }
        ]}
        onSubmit={async ([selectedOption, selectedValue]) => {
          if (
            selectedOption === 'email' &&
            (user?.onMailingList === 'true') !== selectedValue // Make sure they're different
          ) {
            try {
              await API.graphql({
                query: updateUser,
                authMode: 'AMAZON_COGNITO_USER_POOLS',
                variables: {
                  input: {
                    id: user?.['custom:ddb_id'],
                    onMailingList: selectedValue
                  }
                }
              });
              createToast(
                'success',
                `Opt-${selectedValue ? 'in' : 'out'} success`,
                'Your preferences have been saved.'
              );
            } catch (error) {
              console.error("Couldn't update user mailing opt in");
              createToast(
                'error',
                `Opt-${selectedValue ? 'in' : 'out'} error`,
                'There was an error updating your preferences. Please try again.'
              );
            }
          }
        }}
        hasBottomBorder
        buttonText="Save"
        isButtonDisabled={
          ([, selectedValue]) =>
            (user?.onMailingList === 'true') === selectedValue // Make sure they're different
        }
      />
    </AccountLayout>
  );
};
export default Privacy;
