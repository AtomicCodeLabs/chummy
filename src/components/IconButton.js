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
  size = 22,
  Icon,
  disabled,
  to,
  onClick = () => {},
  ...buttonProps
}) => {
  const history = useHistory();
  const location = useLocation();
  const navigateToPage = () => {
    console.log('NAV', location.pathname, to);
    if (disabled) return;
    if (!to) return;
    if (location.pathname === to) return;
    history.push(to);

    onClick();
  };

  return (
    <ContainerButton style={style} onClick={navigateToPage} {...buttonProps}>
      <Suspense fallback={<XIcon />}>{cloneElement(Icon, { size })}</Suspense>
    </ContainerButton>
  );
};
LinkButton.propTypes = {
  style: PropTypes.object,
  size: PropTypes.number,
  Icon: PropTypes.element.isRequired,
  // eslint-disable-next-line react/no-typos
  disabled: PropTypes.boolean,
  to: PropTypes.string,
  // eslint-disable-next-line react/no-typos
  onClick: PropTypes.function
};

export default LinkButton;
