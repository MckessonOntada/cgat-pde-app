import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationViewer from './NotificationViewer';

// NotificationViewer.test.jsx

// Mock context and hooks
const mockUseNotifications = jest.fn();
const mockUseTranslate = jest.fn();
const mockGetTimeAgo = jest.fn();

jest.mock('../../context/NotificationsContext', () => ({
  useNotifications: () => mockUseNotifications()
}));
jest.mock('@src/translations/useTranslation', () => ({
  useTranslate: () => mockUseTranslate()
}));
jest.mock('@src/util/DateUtil', () => ({
  getTimeAgo: (...args) => mockGetTimeAgo(...args)
}));

describe('NotificationViewer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTranslate.mockReturnValue({ t: (key, fallback) => fallback });
  });

  it('renders empty state when no notification is selected', () => {
    mockUseNotifications.mockReturnValue({ selectedNotification: null });

    render(<NotificationViewer />);
    // Instead of getByText(''), check for the empty state span by class
    const emptyDiv = screen.getByText((content, element) => {
      return element.className.includes('notificationViewerEmptyText');
    });
    expect(emptyDiv).toBeInTheDocument();
    // Check for the empty state container by class
    const container = emptyDiv.closest('div');
    expect(container.className).toMatch(/notificationViewer.*notificationViewerEmpty/);
  });

  it('renders notification details when a notification is selected', () => {
    const notification = {
      category: 'Info',
      createdDate: '2024-06-01T12:00:00Z',
      messageTitle: 'Test Title',
      messageDescription: 'Test Description',
      messageContent: '<b>Hello</b>\nWorld'
    };
    mockUseNotifications.mockReturnValue({ selectedNotification: notification });
    mockGetTimeAgo.mockReturnValue('2 hours ago');

    render(<NotificationViewer />);

    expect(screen.getByText(/Category/)).toBeInTheDocument();
    expect(screen.getByText(/Info/)).toBeInTheDocument();
    expect(screen.getByText(/2 hours ago/)).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();

    // HTML content rendered
    const htmlContent = screen.getByText('Hello', { selector: 'b' });
    expect(htmlContent).toBeInTheDocument();
  });

  it('removes newline characters from messageContent', () => {
    const notification = {
      category: 'Alert',
      createdDate: '2024-06-01T12:00:00Z',
      messageTitle: 'Alert Title',
      messageDescription: 'Alert Desc',
      messageContent: '<div>Line1\nLine2\\nLine3</div>'
    };
    mockUseNotifications.mockReturnValue({ selectedNotification: notification });
    mockGetTimeAgo.mockReturnValue('just now');

    render(<NotificationViewer />);
    const htmlDiv = screen.getByText(/Line1Line2Line3/);
    expect(htmlDiv).toBeInTheDocument();
  });

  it('calls translation function with correct key', () => {
    const tMock = jest.fn((key, fallback) => fallback);
    mockUseTranslate.mockReturnValue({ t: tMock });
    mockUseNotifications.mockReturnValue({
      selectedNotification: {
        category: 'Test',
        createdDate: '2024-06-01T12:00:00Z',
        messageTitle: 'Title',
        messageDescription: 'Desc',
        messageContent: ''
      }
    });
    mockGetTimeAgo.mockReturnValue('now');

    render(<NotificationViewer />);
    expect(tMock).toHaveBeenCalledWith('notification.category', 'Category');
  });

  it('does not render HTML content div if messageContent is empty', () => {
    mockUseNotifications.mockReturnValue({
      selectedNotification: {
        category: 'Test',
        createdDate: '2024-06-01T12:00:00Z',
        messageTitle: 'Title',
        messageDescription: 'Desc',
        messageContent: ''
      }
    });
    mockGetTimeAgo.mockReturnValue('now');

    render(<NotificationViewer />);
    // There is no testid, so check by class
    const htmlContent = document.querySelector('.notificationHtmlContent');
    expect(htmlContent).toBeNull();
  });

  it('renders correctly when selectedNotification is undefined', () => {
    mockUseNotifications.mockReturnValue({});
    render(<NotificationViewer />);
    const emptyDiv = screen.getByText((content, element) => {
      return element.className.includes('notificationViewerEmptyText');
    });
    expect(emptyDiv).toBeInTheDocument();
    const container = emptyDiv.closest('div');
    expect(container.className).toMatch(/notificationViewer.*notificationViewerEmpty/);
  });

  it('renders special characters in title and description', () => {
    const notification = {
      category: 'Special',
      createdDate: '2024-06-01T12:00:00Z',
      messageTitle: 'Title & <Test>',
      messageDescription: 'Desc "quoted"',
      messageContent: ''
    };
    mockUseNotifications.mockReturnValue({ selectedNotification: notification });
    mockGetTimeAgo.mockReturnValue('yesterday');

    render(<NotificationViewer />);
    expect(screen.getByText('Title & <Test>')).toBeInTheDocument();
    expect(screen.getByText('Desc "quoted"')).toBeInTheDocument();
  });

  it('renders HTML content with multiple tags', () => {
    const notification = {
      category: 'HTML',
      createdDate: '2024-06-01T12:00:00Z',
      messageTitle: 'HTML Title',
      messageDescription: 'HTML Desc',
      messageContent: '<div><b>Bold</b> <i>Italic</i></div>'
    };
    mockUseNotifications.mockReturnValue({ selectedNotification: notification });
    mockGetTimeAgo.mockReturnValue('now');

    render(<NotificationViewer />);
    expect(screen.getByText('Bold', { selector: 'b' })).toBeInTheDocument();
    expect(screen.getByText('Italic', { selector: 'i' })).toBeInTheDocument();
  });

  it('renders correct time ago for notification', () => {
    const notification = {
      category: 'Time',
      createdDate: '2024-06-01T12:00:00Z',
      messageTitle: 'Time Title',
      messageDescription: 'Time Desc',
      messageContent: ''
    };
    mockUseNotifications.mockReturnValue({ selectedNotification: notification });
    mockGetTimeAgo.mockReturnValue('5 minutes ago');

    render(<NotificationViewer />);
    expect(screen.getByText(/5 minutes ago/)).toBeInTheDocument();
  });

  it('renders both time ago and formatted date', () => {
    const notification = {
      category: 'Time',
      createdDate: '2024-06-01T12:34:00Z',
      messageTitle: 'Time Title',
      messageDescription: 'Time Desc',
      messageContent: ''
    };
    mockUseNotifications.mockReturnValue({ selectedNotification: notification });
    mockGetTimeAgo.mockReturnValue('just now');

    render(<NotificationViewer />);
    expect(screen.getByText(/just now/)).toBeInTheDocument();
    expect(screen.getByText(/06\/01\/2024/)).toBeInTheDocument();
  });
});
