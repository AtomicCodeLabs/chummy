import React, { useState, cloneElement } from 'react';
import { useLocation } from '@reach/router';
import { CgMenu, CgClose } from 'react-icons/cg';
import clsx from 'clsx';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

import NavItem from './NavItem';
import ActionButton from '../buttons/ActionButton';
import { defaultRoutes } from './routes';
import Logo from '../Logo';
import { matchRoutes } from '../../utils';

const Navbar = ({
  bgColor,
  secondaryBgColor,
  isSimpleNavbar = false,
  isSticky = true
}) => {
  const { pathname } = useLocation();
  const [isScrollAtTop, setIsScrollAtTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useScrollPosition(
    ({ currPos }) => {
      const isTop = currPos.y >= (isSimpleNavbar ? 0 : -40); // tailwind 10 === 2.5rem === 40px
      if (isTop !== isScrollAtTop) setIsScrollAtTop(isTop);
    },
    [isScrollAtTop]
  );

  return (
    <div
      className={clsx(
        'box-border flex flex-col mx-auto w-full flex-nowrap',
        'pb-4 md:py-2.5 z-20',
        `transition-colors duration-300  bg-transparent md:${secondaryBgColor} md:border-b-2 md:border-gray-300`,
        { 'sticky md:top-0': isSticky },
        {
          '-top-10 pt-14': !isSimpleNavbar,
          'top-0 pt-4': isSimpleNavbar,
          [`${secondaryBgColor} shadow-sm border-b-2`]:
            !isScrollAtTop || isSimpleNavbar,
          [bgColor]: isScrollAtTop && !isSimpleNavbar
        }
      )}
    >
      <nav
        className={clsx('w-full mx-auto bg-transparent', {
          'px-14 md:px-6 max-w-6xl': !isSimpleNavbar,
          'px-4 md:px-2.5': isSimpleNavbar
        })}
      >
        <div className="flex items-center justify-between flex-nowrap">
          {/* Left */}
          <div className="inline-flex flex-row items-center flex-1">
            <Logo
              isResponsive
              isSimpleNavbar
              className="h-12"
              logoClassName="mr-1.5 w-7 md:w-5"
            />
          </div>
          {/* End Left */}

          {!isSimpleNavbar && (
            <>
              {/* Right */}
              <div className="inline-flex items-start">
                <div className="block md:hidden">
                  {defaultRoutes.map(({ name, pathname: rPathname }) => (
                    <NavItem
                      key={rPathname}
                      to={rPathname}
                      isActive={matchRoutes(rPathname, pathname)}
                      className="px-4 py-2"
                    >
                      {name}
                    </NavItem>
                  ))}
                  <ActionButton to="/signin" className="ml-4">
                    Sign in with Github
                  </ActionButton>
                </div>
                <div className="hidden md:block">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={toggleMenu}
                    onKeyDown={toggleMenu}
                    className="cursor-pointer"
                  >
                    {cloneElement(isMenuOpen ? <CgClose /> : <CgMenu />, {
                      className: 'text-sm h-full w-7 md:w-5'
                    })}
                  </div>
                </div>
              </div>
              {/* End Right */}
            </>
          )}
        </div>
        {/* Mobile Menu */}
        {!isSimpleNavbar && isMenuOpen && (
          <div className="absolute z-20 hidden my-2.5 -mx-6 bg-white w-full border-b-2 border-gray-300 md:flex md:flex-col">
            <div className="h-px bg-gray-300" />
            {defaultRoutes.map(({ name, pathname: rPathname }) => (
              <NavItem
                key={rPathname}
                to={rPathname}
                isActive={rPathname === pathname}
                isMobile
                className="px-6 py-4"
              >
                {name}
              </NavItem>
            ))}
            {/* <div className="h-px bg-gray-300"></div> */}
            <div className="flex py-4 -mt-2">
              <ActionButton to="/signin" className="ml-4">
                Sign in with Github
              </ActionButton>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;