import React from 'react';
import clsx from 'clsx';

import FooterColumn from './FooterColumn';
import Logo from '../Logo';

const footerRoutes = {
  Product: [
    {
      name: 'Try Chummy',
      pathname: '/signin'
    },
    {
      name: 'Features',
      pathname: '/features'
    },
    {
      name: 'Pricing',
      pathname: '/checkout'
    },
    {
      name: "What's new?",
      pathname: '/changelog'
    }
  ],
  Integrations: [
    {
      name: 'Google Chrome',
      pathname: '/browsers/chrome'
    },
    {
      name: 'Firefox',
      pathname: '/browsers/firefox'
    },
    {
      name: 'Microsoft Edge',
      pathname: '/browsers/edge'
    },
    {
      name: 'Opera',
      pathname: '/browsers/opera'
    }
  ],
  Company: [
    {
      name: 'About us',
      pathname: '/team'
    },
    // {
    //   name: 'Security',
    //   pathname: '/security'
    // },
    {
      name: 'Privacy',
      pathname: '/privacy'
    },
    {
      name: 'Terms of Service',
      pathname: '/terms'
    }
  ],
  'Contact Us': [
    {
      name: 'Github',
      pathname: 'https://github.com/AtomicCodeLabs/chummy'
    },
    {
      name: 'Feature',
      pathname:
        'https://github.com/AtomicCodeLabs/chummy/issues/new?assignees=&labels=feature-request&template=feature-request.md&title=%5BFEAT%5D+'
    },
    {
      name: 'Bug',
      pathname:
        'https://github.com/AtomicCodeLabs/chummy/issues/new?assignees=&labels=bug-report&template=bug.md&title=%5BBUG%5D+'
    },
    {
      name: 'Email us',
      pathname: 'mailto: hello@atomiccode.io'
    }
  ]
};

const Footer = ({ className }) => (
  <div
    className={clsx('flex flex-col', className)}
    // style={{ top: fitFooter ? '100vh' : 'auto' }}
  >
    <div className="bg-gray-700">
      <div className="box-border flex flex-row flex-wrap justify-between w-full max-w-6xl pt-24 pb-12 mx-auto md:pt-12 md:pb-12 px-14 md:px-6 ">
        <div className="flex flex-col w-32 mb-8 md:w-full">
          <Logo
            isDarkBg
            hideIcon
            className="h-12"
            logoClassName="mr-1.5 w-7 md:w-5"
          />
        </div>
        <div className="flex flex-col md:w-1/2 sm:w-full">
          <FooterColumn title="Product" items={footerRoutes.Product} />
        </div>
        <div className="flex flex-col md:w-1/2 sm:w-full">
          <FooterColumn
            title="Integrations"
            items={footerRoutes.Integrations}
          />
        </div>
        <div className="flex flex-col md:flex-row md:w-full sm:flex-col">
          <FooterColumn
            className="md:w-1/2"
            title="Company"
            items={footerRoutes.Company}
          />
          <FooterColumn
            className="md:w-1/2"
            title="Contact Us"
            items={footerRoutes['Contact Us']}
          />
        </div>
      </div>
    </div>
    <div
      className={clsx(
        'flex justify-end py-10 mx-auto px-14 md:px-6 w-full',
        'bg-gray-900 text-gray-400 text-xxs'
      )}
    >
      Made with ❤️️ by AtomicCode ©
    </div>
  </div>
);

export default Footer;
