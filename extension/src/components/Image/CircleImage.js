import React, { useState, cloneElement } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { XCircleIcon } from '@primer/octicons-react';
import {
  fieldBackgroundColor,
  fieldBackgroundLightColor
} from '../../constants/theme';

const Container = styled.img`
  width: 100%;
  max-width: ${({ size }) => size}px;
  max-height: ${({ size }) => size}px;
  border: 1px solid ${fieldBackgroundColor};
  border-radius: 100%;
  transition: border 100ms;

  &:hover {
    border: 1px solid ${fieldBackgroundLightColor};
  }
`;

const CircleImage = ({ size, src, alt, PlaceholderIcon }) => {
  const [error, setError] = useState(false);
  return (
    <>
      {error ? (
        cloneElement(PlaceholderIcon, { size })
      ) : (
        <Container
          size={size}
          src={src}
          alt={alt}
          onError={() => {
            setError(true);
          }}
        />
      )}
    </>
  );
};

CircleImage.propTypes = {
  size: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  PlaceholderIcon: PropTypes.element
};

CircleImage.defaultProps = {
  alt: 'circle-image',
  PlaceholderIcon: <XCircleIcon />
};

export default CircleImage;
