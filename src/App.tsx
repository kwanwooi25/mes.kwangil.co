import Loading from 'ui/elements/Loading';
import { DEFAULT_PAGE, Path } from 'const';
import { useAuth, useRefreshLoginMutation } from 'features/auth/authHook';
import Notifier from 'features/notification/Notifier';
import React, { ComponentType, lazy, Suspense, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router';

const AccountPage = lazy(() => import('ui/pages/account/AccountPage'));
const LoginPage = lazy(() => import('ui/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('ui/pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('ui/pages/dashboard/DashboardPage'));
const PlatePage = lazy(() => import('ui/pages/plate/PlatePage'));
const ProductPage = lazy(() => import('ui/pages/product/ProductPage'));
const SettingsPage = lazy(() => import('ui/pages/settings/SettingsPage'));
const UsersPage = lazy(() => import('ui/pages/users/UsersPage'));
const WorkOrderPage = lazy(() => import('ui/pages/workOrder/WorkOrderPage'));

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
  const { isTokenExists, refreshLogin } = useRefreshLoginMutation();

  useEffect(() => {
    if (isTokenExists) {
      refreshLogin();
    }
  }, []);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Switch>
          <PublicRoute path={Path.LOGIN} component={LoginPage} />
          <PublicRoute path={Path.REGISTER} component={RegisterPage} />
          <PrivateRoute path={Path.DASHBOARD} component={DashboardPage} />
          <PrivateRoute path={Path.ACCOUNTS} component={AccountPage} />
          <PrivateRoute path={Path.PRODUCTS} component={ProductPage} />
          <PrivateRoute path={Path.PLATES} component={PlatePage} />
          <PrivateRoute path={Path.WORK_ORDERS} component={WorkOrderPage} />
          <PrivateRoute path={Path.USERS} component={UsersPage} />
          <PrivateRoute path={Path.SETTINGS} component={SettingsPage} />
          <Redirect to={DEFAULT_PAGE} />
        </Switch>
      </Suspense>
      <Notifier />
    </>
  );
}

export default App;
