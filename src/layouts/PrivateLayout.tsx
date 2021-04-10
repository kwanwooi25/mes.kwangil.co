import { Redirect, Route } from 'react-router-dom';

import { LayoutProps } from 'types/props';
import { Path } from 'const';
import React from 'react';
import { useAuth } from 'features/auth/authHook';
// import { Theme, createStyles, makeStyles } from '@material-ui/core';


// const useStyles = makeStyles((theme: Theme) => createStyles({}));

const PrivateLayout = ({ component: Component, ...rest }: LayoutProps) => {
  const { isLoggedIn } = useAuth();
  // const classes = useStyles();

  return isLoggedIn ? (
    <Route
      {...rest}
      render={(matchProps) => (
        <>
          {/* <Navigation {...matchProps} /> */}
          <Component {...matchProps} {...rest} />
        </>
      )}
    />
  ) : (
    <Redirect to={Path.LOGIN} />
  );
};

export default PrivateLayout;
