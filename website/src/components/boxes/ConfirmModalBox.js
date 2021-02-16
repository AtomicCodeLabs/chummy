import React from 'react';
import { ModalWrapper, Reoverlay } from 'reoverlay';

import 'reoverlay/lib/ModalWrapper.css';
import ActionButton from '../buttons/ActionButton';
import './ConfirmModalBox.css';

const ConfirmModal = ({ confirmText, onConfirm }) => {
  const closeModal = () => {
    Reoverlay.hideModal();
  };

  return (
    <ModalWrapper contentContainerClassName="confirmModal">
      <div className="flex flex-col items-center justify-center px-10 py-10 overflow-hidden text-center bg-white rounded-sm shadow-lg md:py-10 md:px-8 sm:px-8">
        <h3>{confirmText}</h3>
        <div className="flex flex-row h-10 mx-auto my-3">
          <ActionButton
            onClick={onConfirm}
            className="w-16 mx-3 my-auto"
            bgColor="bg-green-500"
          >
            Yes
          </ActionButton>
          <ActionButton
            onClick={closeModal}
            className="w-16 mx-3 my-auto"
            bgColor="bg-gray-500"
          >
            No
          </ActionButton>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ConfirmModal;
