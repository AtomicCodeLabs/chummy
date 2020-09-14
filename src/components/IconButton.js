/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */

import React, { Suspense, cloneElement } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { XIcon } from '@primer/octicons-react';

const ContainerButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;

  /* width: 100%; */
  height: 100%;
`;

const LinkButton = ({ style = {}, size = 22, Icon, ...buttonProps }) => {
  return (
    <ContainerButton style={style} {...buttonProps}>
      <Suspense fallback={<XIcon />}>{cloneElement(Icon, { size })}</Suspense>
    </ContainerButton>
  );
};
LinkButton.propTypes = {
  style: PropTypes.object,
  size: PropTypes.number,
  Icon: PropTypes.element.isRequired
};

export default LinkButton;
