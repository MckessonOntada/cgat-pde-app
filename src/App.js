import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';

import Navigation from './Navigation';
import OktaConfigLoader from './OktaConfigLoader';
import Snackbar from './components/snackBar/Snackbar';
import Alert from './components/alert/Alert';
import Modal from './components/modal/Modal';

import { messages } from './translations/messages';
import { currentLocale } from './translations/i18n';
import store from './store/store';
import AppRoutes from './routes/AppRoutes';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <IntlProvider messages={messages[currentLocale]} locale={currentLocale}>
          <BrowserRouter basename={AppRoutes.pathAppBase}>
            <OktaConfigLoader>
              <Snackbar />
              <Alert />
              <Modal />
              <Navigation />
            </OktaConfigLoader>
          </BrowserRouter>
        </IntlProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
