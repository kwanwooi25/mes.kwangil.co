import 'lib/wdyr';
import 'i18n';

import store, { history } from 'app/store';
import { ConnectedRouter } from 'connected-react-router';
import { DialogProvider } from 'features/dialog/dialogHook';
import { theme } from 'lib/muiTheme';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import App from './App';
import * as serviceWorker from './serviceWorker';

import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider>
              <DialogProvider>
                <App />
              </DialogProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
