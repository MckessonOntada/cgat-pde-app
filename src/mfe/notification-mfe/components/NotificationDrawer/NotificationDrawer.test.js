import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useNotifications } from '../../context/NotificationsContext';
import { NotificationDrawer } from './NotificationDrawer';

// NotificationDrawer.test.jsx

// Mocks
jest.mock('@src/translations/useTranslation', () => ({
  useTranslate: () => ({
    t: (key) =>
      ({
        'notifications.title': 'Notifications',
        'notifications.cta.seeAllNotifications': 'See All Notifications'
      }[key] || key)
  })
}));

const setNotificationDrawerOpen = jest.fn();
let mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

jest.mock('../../context/NotificationsContext', () => ({
  useNotifications: jest.fn()
}));

jest.mock('@src/components/floating-drawer', () => (props) => (
  <div
    data-testid="floating-drawer"
    data-open={props.open ? 'true' : 'false'}
  >
    <div data-testid="drawer-heading">{props.heading}</div>
    <div data-testid="drawer-controls">{props.controls}</div>
    <button data-testid="close-drawer-btn" onClick={props.onClose}>
      Close
    </button>
    {props.children}
  </div>
));

jest.mock('@mckesson/mcp-component-library', () => ({
  Button: (props) => (
    <button data-testid="see-all-btn" onClick={props.onClick} aria-label={props['aria-label']}>
      {props.label}
    </button>
  )
}));

jest.mock('../NotificationLister/NotificationLister', () => (props) => (
  <div data-testid="notification-lister" data-is-drawer-view={props.isDrawerView} data-has-close-drawer={typeof props.closeDrawer === 'function'}></div>
));

jest.mock('./NotificationDrawer.module.scss', () => ({
  notificationDrawer: 'notificationDrawer',
  controls: 'controls',
  notificationDrawerContent: 'notificationDrawerContent'
}));

describe('NotificationDrawer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
  });

  function setup(overrides = {}) {
    useNotifications.mockReturnValue({
      unreadCount: 3,
      notificationDrawerOpen: true,
      setNotificationDrawerOpen,
      isNotificationsPage: false,
      ...overrides
    });
    return render(<NotificationDrawer />);
  }

  it('renders drawer with unread count in heading', () => {
    const { getByTestId } = setup();
    expect(getByTestId('drawer-heading')).toHaveTextContent('Notifications (3)');
  });

  it('renders drawer with heading only when unreadCount is 0', () => {
    const { getByTestId } = setup({ unreadCount: 0 });
    expect(getByTestId('drawer-heading')).toHaveTextContent('Notifications');
  });

  it('renders the "See All Notifications" button with correct label and aria-label', () => {
    const { getByTestId } = setup();
    const btn = getByTestId('see-all-btn');
    expect(btn).toHaveTextContent('See All Notifications');
    expect(btn).toHaveAttribute('aria-label', 'See All Notifications');
  });

  it('calls setNotificationDrawerOpen(false) when close handler is called', () => {
    const { getByTestId } = setup();
    fireEvent.click(getByTestId('close-drawer-btn'));
    expect(setNotificationDrawerOpen).toHaveBeenCalledWith(false);
  });

  it('calls setNotificationDrawerOpen(false) and navigates on "See All Notifications" click when not on notifications page', () => {
    const { getByTestId } = setup({ isNotificationsPage: false });
    fireEvent.click(getByTestId('see-all-btn'));
    expect(setNotificationDrawerOpen).toHaveBeenCalledWith(false);
    expect(mockNavigate).toHaveBeenCalledWith('/notifications');
  });

  it('calls setNotificationDrawerOpen(false) but does not navigate if already on notifications page', () => {
    const { getByTestId } = setup({ isNotificationsPage: true });
    fireEvent.click(getByTestId('see-all-btn'));
    expect(setNotificationDrawerOpen).toHaveBeenCalledWith(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders NotificationLister with correct props', () => {
    const { getByTestId } = setup();
    const lister = getByTestId('notification-lister');
    expect(lister.getAttribute('data-is-drawer-view')).toBe('true');
    expect(lister.getAttribute('data-has-close-drawer')).toBe('true');
  });

  it('renders NotificationLister', () => {
    const { getByTestId } = setup();
    expect(getByTestId('notification-lister')).toBeInTheDocument();
  });

  it('drawer open prop reflects notificationDrawerOpen', () => {
    const { getByTestId, rerender } = setup({ notificationDrawerOpen: true });
    expect(getByTestId('floating-drawer').getAttribute('data-open')).toBe('true');

    useNotifications.mockReturnValue({
      unreadCount: 1,
      notificationDrawerOpen: false,
      setNotificationDrawerOpen,
      isNotificationsPage: false
    });
    rerender(<NotificationDrawer />);
    expect(getByTestId('floating-drawer').getAttribute('data-open')).toBe('false');
  });
});
