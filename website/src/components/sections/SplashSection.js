import React from 'react';

const SplashSection = ({ children }) => (
  <>
    <div className="flex flex-col -mb-40 bg-green-300 h-150">
      {children}
      <div className="flex-1" />
      <svg
        className="text-white fill-current"
        x="0"
        y="0"
        viewBox="0 0 1420 106"
        preserveAspectRatio="none"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0C558.348 61.8524 869.206 60.7752 1420 0V106H0V0Z" />
      </svg>
    </div>
  </>
);

export default SplashSection;
