/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */

import React, { Suspense, cloneElement } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { XIcon } from '@primer/octicons-react';

const ContainerButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  /* width: 100%; */
  height: 100%;
`;

const LinkButton = ({
  style = {},
  Icon,
  disabled,
  to,
  onClick = () => {},
  ...buttonProps
}) => {
  const history = useHistory();
  const location = useLocation();
  const navigateToPage = () => {
    onClick();

    if (disabled) return;
    if (!to) return;
    if (location.pathname === to) return;
    history.push(to);
  };

  return (
    <ContainerButton style={style} onClick={navigateToPage}>
      <Suspense fallback={<XIcon {...buttonProps} />}>
        {cloneElement(Icon, buttonProps)}
      </Suspense>
    </ContainerButton>
  );
};
LinkButton.propTypes = {
  style: PropTypes.object,
  Icon: PropTypes.element.isRequired,
  // eslint-disable-next-line react/no-typos
  disabled: PropTypes.bool,
  to: PropTypes.string,
  // eslint-disable-next-line react/no-typos
  onClick: PropTypes.func
};

export default LinkButton;
