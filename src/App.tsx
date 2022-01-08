import Loading from 'components/Loading';
import { DEFAULT_PAGE, Path } from 'const';
import AccountPage from 'features/account/AccountPage';
import { useAuth, useRefreshLoginMutation } from 'features/auth/authHook';
import LoginPage from 'features/auth/LoginPage';
import RegisterPage from 'features/auth/RegisterPage';
import DashboardPage from 'features/dashboard/DashboardPage';
// import DeliveryPage from 'features/delivery/DeliveryPage';
import Notifier from 'features/notification/Notifier';
import PlatePage from 'features/plate/PlatePage';
import ProductPage from 'features/product/ProductPage';
import QuotePage from 'features/quote/QuotePage';
import SettingsPage from 'features/settings/SettingsPage';
import UsersPage from 'features/users/UsersPage';
import WorkOrderPage from 'features/workOrder/WorkOrderPage';
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
        <PrivateRoute path={Path.QUOTES} component={QuotePage} />
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
