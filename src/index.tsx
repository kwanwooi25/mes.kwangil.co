import 'lib/wdyr';
import 'i18n';
import './index.css';

import store, { history } from 'app/store';
import { ConnectedRouter } from 'connected-react-router';
import { DialogProvider } from 'features/dialog/dialogHook';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';

import App from './App';

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
          <SnackbarProvider>
            <DialogProvider>
              <App />
            </DialogProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
