/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { isLoggedIn } from '../utils/auth';

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  if (!isLoggedIn() && location.pathname !== `/app/login`) {
    // If we’re not logged in, redirect to the home page.
    navigate(`/app/login`, { replace: true });
    return null;
  }

  return <Component {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.node.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired
};

export default PrivateRoute;
