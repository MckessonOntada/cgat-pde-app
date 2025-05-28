import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import NotificationLister from './NotificationLister';

// NotificationLister.test.jsx

global.BroadcastChannel = class {
  constructor() {}
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
};

// Mocks
jest.mock('@src/translations/useTranslation', () => ({
  useTranslate: () => ({ t: (key) => key }),
}));
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock('@mckesson/mcp-component-library', () => ({
  CustomCard: ({ children, ...props }) => <div {...props}>{children}</div>,
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  Loader: () => <div data-testid="loader" />,
}));
jest.mock('../EmptyNotificationsView/EmptyNotificationsView', () => 
  ({ text, subtext }) => <div data-testid="empty">{text} {subtext}</div>
);

const mockNotifications = [
  { id: 1, messageTitle: 'Title 1', messageDescription: 'Desc 1', createdDate: '2024-06-01T12:00:00Z', readStatus: false },
  { id: 2, messageTitle: 'Title 2', messageDescription: 'Desc 2', createdDate: '2024-06-02T12:00:00Z', readStatus: true },
];

const setup = ({
  isDrawerView = false,
  loadingMoreNotifications = false,
  loadingNotifications = false,
  loadingDrawerNotifications = false,
  notifications = mockNotifications,
  drawerNotifications = mockNotifications,
  filteredUnreadCount = 1,
  unreadCount = 1,
  loadMoreNotifications = jest.fn(),
} = {}) => {
  jest.resetAllMocks();
  const setSelectedNotification = jest.fn();
  const markAllNotificationsAsRead = jest.fn();

  jest.spyOn(require('../../context/NotificationsContext'), 'useNotifications').mockReturnValue({
    drawerNotifications,
    notifications,
    markAllNotificationsAsRead,
    selectedNotification: null,
    setSelectedNotification,
    loadMoreNotifications,
    loadingDrawerNotifications,
    loadingNotifications,
    loadingMoreNotifications,
    filteredUnreadCount,
    unreadCount,
  });

  const utils = render(
    <NotificationLister isDrawerView={isDrawerView} isMobileView={false} />
  );
  return { ...utils, loadMoreNotifications };
};

describe('NotificationLister - handleScroll', () => {
  it('calls loadMoreNotifications when scrolled to bottom and not loadingMoreNotifications', () => {
    const loadMoreNotifications = jest.fn();
    const { container } = setup({ loadMoreNotifications });

    // Find the scrollable content div
    const content = container.querySelector('.notification-lister-content');
    // Mock scroll properties
    Object.defineProperty(content, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(content, 'clientHeight', { value: 100, writable: true });
    Object.defineProperty(content, 'scrollHeight', { value: 200, writable: true });

    // Fire scroll event
    act(() => {
      fireEvent.scroll(content);
    });

    expect(loadMoreNotifications).toHaveBeenCalled();
  });

  it('does NOT call loadMoreNotifications if already loadingMoreNotifications', () => {
    const loadMoreNotifications = jest.fn();
    const { container } = setup({ loadMoreNotifications, loadingMoreNotifications: true });

    const content = container.querySelector('.notification-lister-content');
    Object.defineProperty(content, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(content, 'clientHeight', { value: 100, writable: true });
    Object.defineProperty(content, 'scrollHeight', { value: 200, writable: true });

    act(() => {
      fireEvent.scroll(content);
    });

    expect(loadMoreNotifications).not.toHaveBeenCalled();
  });

  it('does NOT call loadMoreNotifications if not scrolled to bottom', () => {
    const loadMoreNotifications = jest.fn();
    const { container } = setup({ loadMoreNotifications });

    const content = container.querySelector('.notification-lister-content');
    Object.defineProperty(content, 'scrollTop', { value: 50, writable: true });
    Object.defineProperty(content, 'clientHeight', { value: 100, writable: true });
    Object.defineProperty(content, 'scrollHeight', { value: 200, writable: true });

    act(() => {
      fireEvent.scroll(content);
    });

    expect(loadMoreNotifications).not.toHaveBeenCalled();
  });

  it('does NOT call loadMoreNotifications in drawer view', () => {
    const loadMoreNotifications = jest.fn();
    const { container } = setup({ loadMoreNotifications, isDrawerView: true });

    const content = container.querySelector('.notification-lister-content');
    if (content) {
      Object.defineProperty(content, 'scrollTop', { value: 100, writable: true });
      Object.defineProperty(content, 'clientHeight', { value: 100, writable: true });
      Object.defineProperty(content, 'scrollHeight', { value: 200, writable: true });

      act(() => {
        fireEvent.scroll(content);
      });
    }

    expect(loadMoreNotifications).not.toHaveBeenCalled();
  });
});