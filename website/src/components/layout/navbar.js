import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from '@reach/router';

import NavItem from './NavItem';
import ActionButton from '../buttons/ActionButton';
import routes from './routes';

const Navbar = ({ siteTitle }) => {
  const { pathname } = useLocation();
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-transparent">
      <div className="flex items-center justify-between flex-nowrap">
        {/* Left */}
        <div className="inline-flex">
          <div>Icon</div>
          <div className="block sm:hidden">{siteTitle}</div>
        </div>
        {/* End Left */}

        {/* Right */}
        <div className="inline-flex items-center">
          <div className="block sm:hidden">
            {routes.map(({ name, pathname: rPathname }) => (
              <NavItem
                key={rPathname}
                to={rPathname}
                isActive={rPathname === pathname}
              >
                {name}
              </NavItem>
            ))}
            <ActionButton
              to="signin/"
              state={{ fromWebsite: true }}
              className="mx-4"
            >
              Sign in with Github
            </ActionButton>
          </div>
          <div className="hidden bg-blue-500 sm:block">
            <a href="https://github.com/alexkim205/chummy">
              <svg
                className="block w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </a>
          </div>
        </div>
        {/* End Right */}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  siteTitle: PropTypes.string
};

Navbar.defaultProps = {
  siteTitle: ``
};

export default Navbar;
