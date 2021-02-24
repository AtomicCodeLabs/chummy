import React, { useState } from 'react';
import { ModalWrapper, Reoverlay } from 'reoverlay';

import 'reoverlay/lib/ModalWrapper.css';
import ActionButton from '../buttons/ActionButton';
import './ConfirmModalBox.css';

const ConfirmModal = ({
  confirmText,
  subText,
  yesText = 'Yes',
  noText = 'No',
  yesBgColor = 'bg-green-500',
  noBgColor = 'bg-gray-400',
  yesButtonProps = {},
  closeAfterConfirm = true,
  onConfirm = async () => {}
}) => {
  const [loading, setLoading] = useState(false);
  const closeModal = () => {
    Reoverlay.hideModal();
  };

  return (
    <ModalWrapper contentContainerClassName="confirmModal">
      <div className="flex flex-col items-center justify-center max-w-lg px-10 py-10 mx-6 overflow-hidden text-center rounded-lg shadow-lg bg-gray-50 md:py-10 md:px-8 sm:px-8">
        <h3 className="font-normal">{confirmText}</h3>
        {subText && (
          <p className="mt-2 mb-4 font-light text-gray-600">{subText}</p>
        )}
        <div className="flex flex-row h-10 mx-auto my-3">
          <ActionButton
            onClick={async () => {
              setLoading(true);
              await onConfirm();
              setLoading(false);
              if (closeAfterConfirm) {
                closeModal();
              }
            }}
            isLoading={loading}
            className="mx-3 my-auto"
            bgColor={yesBgColor}
            {...yesButtonProps}
          >
            {yesText}
          </ActionButton>
          <ActionButton
            onClick={closeModal}
            className="mx-3 my-auto"
            bgColor={noBgColor}
          >
            {noText}
          </ActionButton>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ConfirmModal;
