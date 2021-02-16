import React from 'react';
import cogoToast from 'cogo-toast';

import '../components/notifications/cogo.css';

const useToaster = () => {
  const createToast = (type, title, message) => {
    const cogoDo = type === 'success' ? cogoToast.success : cogoToast.error;
    const { hide } = cogoDo(
      <>
        <h5 className="mt-0 mb-1 font-medium text-gray-700">{title}</h5>
        <span className="text-sm font-light text-gray-700 sm:text-xs">
          {message}
        </span>
      </>,
      {
        position: 'bottom-right',
        onClick: () => {
          hide();
        }
      }
    );
  };

  return { createToast };
};

export default useToaster;
