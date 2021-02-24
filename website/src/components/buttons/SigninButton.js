import React from 'react';

import ActionButton from './ActionButton';
import useUser from '../../hooks/useUser';

const SigninButton = ({
  className,
  signedInText = 'Go to my account',
  signedOutText = 'Sign in with Github',
  ...props
}) => {
  const user = useUser();

  return (
    <ActionButton
      to={user ? '/account' : '/signin'}
      className={className}
      {...props}
    >
      {user ? signedInText : signedOutText}
    </ActionButton>
  );
};

export default SigninButton;
