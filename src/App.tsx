import Loading from 'components/Loading';
import { DEFAULT_PAGE, Path } from 'const';
import { useAuth, useRefreshLoginMutation } from 'features/auth/authHook';
import Notifier from 'features/notification/Notifier';
import AccountPage from 'ui/pages/account/AccountPage';
import LoginPage from 'ui/pages/auth/LoginPage';
import RegisterPage from 'ui/pages/auth/RegisterPage';
import DashboardPage from 'ui/pages/dashboard/DashboardPage';
import PlatePage from 'ui/pages/plate/PlatePage';
import ProductPage from 'ui/pages/product/ProductPage';
// import QuotePage from 'ui/pages/quote/QuotePage';
import SettingsPage from 'ui/pages/settings/SettingsPage';
import UsersPage from 'ui/pages/users/UsersPage';
import WorkOrderPage from 'ui/pages/workOrder/WorkOrderPage';
import React, { ComponentType, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router';

export interface RouteProps {
  path: string;
  exact?: boolean;
  component: ComponentType<any>;
}

function PublicRoute({ component: Component, ...rest }: RouteProps) {
  const { currentUser } = useAuth();

  return !currentUser ? (
    <Route {...rest} render={(matchProps) => <Component {...matchProps} {...rest} />} />
  ) : (
    <Redirect to={DEFAULT_PAGE} />
  );
}

function PrivateRoute({ component: Component, ...rest }: RouteProps) {
  const { isLoggedIn, navPaths } = useAuth();
  const isPermitted = navPaths.includes(rest.path as Path);

  return isLoggedIn && isPermitted ? (
    <Route {...rest} render={(matchProps) => <Component {...matchProps} {...rest} />} />
  ) : (
    <Redirect to={!isLoggedIn ? Path.LOGIN : DEFAULT_PAGE} />
  );
}

function App() {
  const { isTokenExists, refreshLogin, isRefreshing } = useRefreshLoginMutation();

  useEffect(() => {
    if (isTokenExists) {
      refreshLogin();
    }
  }, []);

  return isRefreshing ? (
    <Loading />
  ) : (
    <>
      <Switch>
        <PublicRoute path={Path.LOGIN} component={LoginPage} />
        <PublicRoute path={Path.REGISTER} component={RegisterPage} />
        <PrivateRoute path={Path.DASHBOARD} component={DashboardPage} />
        <PrivateRoute path={Path.ACCOUNTS} component={AccountPage} />
        {/* <PrivateRoute path={Path.QUOTES} component={QuotePage} /> */}
        <PrivateRoute path={Path.PRODUCTS} component={ProductPage} />
        <PrivateRoute path={Path.PLATES} component={PlatePage} />
        <PrivateRoute path={Path.WORK_ORDERS} component={WorkOrderPage} />
        {/* <PrivateRoute path={Path.DELIVERY} component={DeliveryPage} /> */}
        <PrivateRoute path={Path.USERS} component={UsersPage} />
        <PrivateRoute path={Path.SETTINGS} component={SettingsPage} />
        <Redirect to={DEFAULT_PAGE} />
      </Switch>
      <Notifier />
    </>
  );
}

export default App;
