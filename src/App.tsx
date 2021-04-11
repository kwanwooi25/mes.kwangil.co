import { DEFAULT_PAGE, Path } from 'const';
import { Redirect, Switch } from 'react-router';

import DashboardPage from 'pages/Dashboard';
import Loading from 'components/Loading';
import LoginPage from 'pages/Login';
import PrivateLayout from 'layouts/PrivateLayout';
import PublicLayout from 'layouts/PublicLayout';
import React from 'react';
import { useAuth } from 'features/auth/authHook';

function App() {
  const { isRefreshing } = useAuth();

  return isRefreshing ? (
    <Loading />
  ) : (
    <Switch>
      <PublicLayout path={Path.LOGIN} component={LoginPage} />
      <PrivateLayout path={Path.DASHBOARD} component={DashboardPage} />
      <Redirect to={DEFAULT_PAGE} />
    </Switch>
  );
}

export default App;
