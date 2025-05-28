import '@testing-library/jest-dom';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;
global.URL.createObjectURL = jest.fn();

global.__USERMANAGEMENT_SERVICE_BASE_URL__ = 'http://localhost:3000';
global.__ORDERMANAGEMENT_SERVICE_BASE_URL__ = 'http://localhost:3000';
global.__NOTIFICATION_SERVICE_BASE_URL__ = 'http://localhost:3000';
global.__CURRENT_ENV__ = 'test';
global.__MAIN_BASE_URL__ = 'http://localhost:3000';
global.__INACTIVITY_TIMEOUT__ = 300000;
global.__FS_ORG_ID__ = 'test-org-id'; // <-- Add this line

global.BroadcastChannel = class {
  constructor() {}
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
};
