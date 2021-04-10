import { DEFAULT_PAGE, Path } from 'const';
import { Redirect, Switch } from 'react-router';

import DashboardPage from 'pages/Dashboard';
import LoginPage from './pages/Login';
import PrivateLayout from 'layouts/PrivateLayout';
import PublicLayout from 'layouts/PublicLayout';
import React from 'react';

function App() {
  return (
    <Switch>
      <PublicLayout path={Path.LOGIN} component={LoginPage} />
      <PrivateLayout path={Path.DASHBOARD} component={DashboardPage} />
      <Redirect to={DEFAULT_PAGE} />
    </Switch>
  );
}

export default App;
