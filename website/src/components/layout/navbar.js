import React, { useState, cloneElement } from 'react';
import { useLocation } from '@reach/router';
import { CgMenu, CgClose } from 'react-icons/cg';
import clsx from 'clsx';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

import NavItem from './NavItem';
import ActionButton from '../buttons/ActionButton';
import routes from './routes';
import Logo from '../Logo';

const Navbar = () => {
  const { pathname } = useLocation();
  const [isScrollAtTop, setIsScrollAtTop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useScrollPosition(
    ({ currPos }) => {
      const isTop = currPos.y >= -40; // tailwind 10 === 2.5rem === 40px
      if (isTop !== isScrollAtTop) setIsScrollAtTop(isTop);
    },
    [isScrollAtTop]
  );

  return (
    <div
      className={clsx(
        'box-border flex flex-col mx-auto w-full flex-nowrap',
        'pt-14 pb-4 md:py-2.5 z-20',
        'transition-colors duration-300  bg-transparent md:bg-white md:border-b-2 md:border-gray-300',
        'sticky -top-10 md:top-0',
        {
          'bg-white shadow-sm border-b-2': !isScrollAtTop,
          'bg-green-200': isScrollAtTop
        }
      )}
    >
      <nav className="w-full max-w-6xl mx-auto bg-transparent px-14 md:px-6">
        <div className="flex items-center justify-between flex-nowrap">
          {/* Left */}
          <div className="inline-flex flex-row items-center flex-1">
            <Logo isResponsive />
          </div>
          {/* End Left */}

          {/* Right */}
          <div className="inline-flex items-start">
            <div className="block md:hidden">
              {routes.map(({ name, pathname: rPathname }) => (
                <NavItem
                  key={rPathname}
                  to={rPathname}
                  isActive={rPathname === pathname}
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
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute z-20 hidden my-2.5 -mx-6 bg-white w-full border-b-2 border-gray-300 md:flex md:flex-col">
            <div className="h-px bg-gray-300" />
            {routes.map(({ name, pathname: rPathname }) => (
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
