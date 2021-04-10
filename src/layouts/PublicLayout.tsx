import { Redirect, Route } from 'react-router-dom';
import { Theme, createStyles, makeStyles } from '@material-ui/core';

import { DEFAULT_PAGE } from 'const';
import { LayoutProps } from 'types/props';
import React from 'react';
import { useAuth } from 'features/auth/authHook';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      padding: 0,
    },
  })
);

const PublicLayout = ({ component: Component, ...rest }: LayoutProps) => {
  const classes = useStyles();
  const { isLoggedIn } = useAuth();

  return !isLoggedIn ? (
    <Route
      {...rest}
      render={(matchProps) => (
        <main className={classes.container}>
          <Component {...matchProps} {...rest} />
        </main>
      )}
    />
  ) : (
    <Redirect to={DEFAULT_PAGE} />
  );
};

export default PublicLayout;
