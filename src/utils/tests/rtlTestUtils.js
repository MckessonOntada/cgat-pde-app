import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { createIntl, IntlProvider, createIntlCache } from 'react-intl';
import { messages } from '../../translations/messages';
const currentLocale = 'en';

import { Provider } from 'react-redux';
import store from '../../store/store';

let originalError;

beforeAll(() => {
  originalError = console.error;
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    const message = args.join(' ');
    if (
      message.includes('Warning: ReactDOM.render') ||
      message.includes('fixedHeaderScrollHeight') ||
      message.includes(':first-child')
    ) {
      return;
    }
    originalError(...args);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: ({ id }) => {
      const translationsMessages = require('../../translations/messages')['messages']['en'];
      return translationsMessages[id] || id;
    }
  })
}));

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: () => ({
    data: 'Mocked Data'
  })
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ state: { myValue: 'Mocked State' } }),
  useNavigate: jest.fn()
}));

// jest.mock('react-router-dom', () => ({   ...jest.requireActual('react-router-dom'),   useLocation: () => ({     state: { myValue: 'Mocked State' }, // Provide your own state for testing  }), }));

const AllTheProviders = ({ children }) => {
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
          {children}
        </IntlProvider>
      </QueryClientProvider>
    </Provider>
  );
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// TODO: Incorporate skipping reactDOM.render errors from third part components, etc.

// console.error = (message) => {
//   if (
//     message.includes('ReactDOM.render is no longer supported in React 18') ||
//     message.includes('fixedHeaderScrollHeight') ||
//     message.includes(':first-child')
//   ) {
//     return;
//   }
//   console.error(message);
// };

export { customRender as render };
