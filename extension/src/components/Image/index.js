import React, { useState, cloneElement } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { XIcon } from '@primer/octicons-react';
import {
  fieldBackgroundColor,
  fieldBackgroundLightColor
} from '../../constants/theme';

const Container = styled.img`
  width: 100%;
  max-width: ${({ size }) => size}px;
  max-height: ${({ size }) => size}px;
  border: ${({ borderSize }) => borderSize}px solid ${fieldBackgroundColor};
  border-radius: ${({ borderRadius }) => borderRadius};
  transition: border 100ms;

  &:hover {
    border: ${({ borderSize }) => borderSize}px solid
      ${fieldBackgroundLightColor};
  }
`;

const BaseImage = ({
  size,
  src,
  alt,
  PlaceholderIcon,
  borderRadius,
  borderSize
}) => {
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
          borderRadius={borderRadius}
          borderSize={borderSize}
        />
      )}
    </>
  );
};

BaseImage.propTypes = {
  size: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  PlaceholderIcon: PropTypes.element,
  borderRadius: PropTypes.string,
  borderSize: PropTypes.number
};

BaseImage.defaultProps = {
  alt: 'circle-image',
  PlaceholderIcon: <XIcon />,
  borderRadius: '0',
  borderSize: 0
};

export default BaseImage;
