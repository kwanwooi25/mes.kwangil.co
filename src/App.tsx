import Loading from 'components/Loading';
import { DEFAULT_PAGE, LoadingKeys, NAV_PATHS, Path } from 'const';
import AccountPage from 'features/account/AccountPage';
import { useAuth } from 'features/auth/authHook';
import LoginPage from 'features/auth/LoginPage';
import DashboardPage from 'features/dashboard/DashboardPage';
// import DeliveryPage from 'features/delivery/DeliveryPage';
import { useLoading } from 'features/loading/loadingHook';
import Notifier from 'features/notification/Notifier';
import PlatePage from 'features/plate/PlatePage';
import ProductPage from 'features/product/ProductPage';
import WorkOrderPage from 'features/workOrder/WorkOrderPage';
import React, { ComponentType } from 'react';
import { Redirect, Route, Switch } from 'react-router';

export interface RouteProps {
  path: string;
  exact?: boolean;
  component: ComponentType<any>;
}

const PublicRoute = ({ component: Component, ...rest }: RouteProps) => {
  const { currentUser } = useAuth();

  return !currentUser ? (
    <Route {...rest} render={(matchProps) => <Component {...matchProps} {...rest} />} />
  ) : (
    <Redirect to={DEFAULT_PAGE} />
  );
};

const PrivateRoute = ({ component: Component, ...rest }: RouteProps) => {
  const { isLoggedIn, userRole } = useAuth();
  const navPaths = NAV_PATHS[userRole];
  const isPermitted = navPaths.includes(rest.path as Path);

  return isLoggedIn && isPermitted ? (
    <Route {...rest} render={(matchProps) => <Component {...matchProps} {...rest} />} />
  ) : (
    <Redirect to={!isLoggedIn ? Path.LOGIN : DEFAULT_PAGE} />
  );
};

function App() {
  const { [LoadingKeys.REFRESH_LOGIN]: isRefreshing } = useLoading();

  return isRefreshing ? (
    <Loading />
  ) : (
    <>
      <Switch>
        <PublicRoute path={Path.LOGIN} component={LoginPage} />
        <PrivateRoute path={Path.DASHBOARD} component={DashboardPage} />
        <PrivateRoute path={Path.ACCOUNTS} component={AccountPage} />
        <PrivateRoute path={Path.PRODUCTS} component={ProductPage} />
        <PrivateRoute path={Path.PLATES} component={PlatePage} />
        <PrivateRoute path={Path.WORK_ORDERS} component={WorkOrderPage} />
        {/* <PrivateRoute path={Path.DELIVERY} component={DeliveryPage} /> */}
        <Redirect to={DEFAULT_PAGE} />
      </Switch>
      <Notifier />
    </>
  );
}

export default App;
