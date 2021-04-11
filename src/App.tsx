import { DEFAULT_PAGE, Path } from 'const';
import React, { ComponentType } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import DashboardPage from 'pages/Dashboard';
import Loading from 'components/Loading';
import LoginPage from 'pages/Login';
import Notifier from 'features/notification/Notifier';
import { useAuth } from 'features/auth/authHook';

export interface RouteProps {
  path: string;
  exact?: boolean;
  component: ComponentType<any>;
}

const PublicRoute = ({ component: Component, ...rest }: RouteProps) => {
  const { isLoggedIn } = useAuth();

  return !isLoggedIn ? (
    <Route {...rest} render={(matchProps) => <Component {...matchProps} {...rest} />} />
  ) : (
    <Redirect to={DEFAULT_PAGE} />
  );
};

const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    <Route {...rest} render={(matchProps) => <Component {...matchProps} {...rest} />} />
  ) : (
    <Redirect to={Path.LOGIN} />
  );
};

function App() {
  const { isRefreshing } = useAuth();

  return isRefreshing ? (
    <Loading />
  ) : (
    <>
      <Switch>
        <PublicRoute path={Path.LOGIN} component={LoginPage} />
        <PrivateRoute path={Path.DASHBOARD} component={DashboardPage} />
        <Redirect to={DEFAULT_PAGE} />
      </Switch>
      <Notifier />
    </>
  );
}

export default App;
