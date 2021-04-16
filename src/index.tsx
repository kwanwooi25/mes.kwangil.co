import 'lib/wdyr';
import 'i18n';

import * as serviceWorker from './serviceWorker';

import { QueryClient, QueryClientProvider } from 'react-query';
import store, { history } from 'app/store';

import App from './App';
import { AuthProvider } from 'features/auth/authHook';
import { ConnectedRouter } from 'connected-react-router';
import { CssBaseline } from '@material-ui/core';
import { DialogProvider } from 'features/dialog/dialogHook';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from 'lib/muiTheme';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SnackbarProvider>
                <DialogProvider>
                  <App />
                </DialogProvider>
              </SnackbarProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
