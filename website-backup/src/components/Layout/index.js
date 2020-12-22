import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import Header from '../Header';

// Global styles and component-specific styles.
import './global.css';
import styles from './main.module.css';

const Layout = ({ children }) => (
  <div>
    <Helmet title="Gatsby Simple Firebase Authentication" />
    <Header />
    <main className={styles.main}>{children}</main>
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
