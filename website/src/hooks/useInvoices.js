import { useEffect, useState } from 'react';
import { stripeApi } from '../config/stripe';

const useInvoices = (stripeCustomerId) => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const getInvoices = async () => {
      // Check cache first
      const cachedInvoices = JSON.parse(
        sessionStorage.getItem('currentUserInvoices')
      );
      if (cachedInvoices) {
        setInvoices(cachedInvoices);
        return;
      }

      // Then fetch from stripe
      const response = await stripeApi('/invoices', {
        customer: stripeCustomerId,
        status: 'paid'
      });
      if (response?.data) {
        const newInvoices = response?.data?.data || [];
        sessionStorage.setItem(
          'currentUserInvoices',
          JSON.stringify(newInvoices)
        );
        setInvoices(newInvoices);
      }
    };

    if (stripeCustomerId) {
      getInvoices();
    }
  }, [stripeCustomerId]);

  return invoices;
};

export default useInvoices;
