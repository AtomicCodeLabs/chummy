/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React from 'react';
import format from 'date-fns/format';

import SEO from '../../components/seo';
import AccountLayout from '../../components/layout/AccountLayout';
import { TableRowSection } from '../../components/sections/AccountSection';
import useUser from '../../hooks/useUser';
import useInvoices from '../../hooks/useInvoices';
import Link from '../../components/Link';

const Billing = () => {
  const user = useUser();

  const invoices = useInvoices(user?.['custom:stripe_id']);

  return (
    <AccountLayout title={<h2 className="mb-10">Billing History</h2>}>
      <SEO title="Billing" />
      <TableRowSection
        isHeader
        items={[
          { title: 'Date', width: 3 },
          { title: 'Description', width: 5 },
          { title: 'Total', width: 2 },
          { title: 'Receipt', width: 2 }
        ]}
      />
      {invoices &&
        invoices.map(
          (
            { created, lines: { data: product }, amount_paid, invoice_pdf },
            i
          ) => (
            <TableRowSection
              key={i}
              items={[
                { title: format(created * 1000, 'MMMM do, yyyy'), width: 3 },
                { title: product?.[0]?.price?.nickname, width: 5 },
                { title: amount_paid / 100, width: 2 },
                {
                  title: (
                    <Link className="text-green-600" to={invoice_pdf}>
                      Download
                    </Link>
                  ),
                  width: 2
                }
              ]}
            />
          )
        )}

      <div className="py-3 font-light text-gray-700">
        (All prices are in USD)
      </div>
    </AccountLayout>
  );
};
export default Billing;
