import React from 'react';
import PropTypes from 'prop-types';
import { XCircleIcon } from '@primer/octicons-react';

import BaseImage from './index';

const CircleImage = React.forwardRef((props, ref) => (
  <BaseImage
    ref={ref}
    size={props.size}
    src={props.src}
    alt={props.alt}
    PlaceholderIcon={props.PlaceholderIcon}
    borderRadius="100%"
  />
));

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
