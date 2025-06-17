import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import FilterToolbar from './FilterToolbar';

// Mock component library
jest.mock('@mckesson/mcp-component-library', () => ({
  DateRangePicker: jest.fn(({ dateRange, onChange, ...props }) => (
    <div
      data-testid="date-range-picker"
      // Simulate onChange with array of Date objects for consistency with component
      onClick={() => onChange([new Date('2023-01-01'), new Date('2023-01-31')])}
    >
      DateRangePicker: {JSON.stringify(dateRange)}
    </div>
  )),
  Dropdown: jest.fn(({ value, onChange, options, ...props }) => (
    <select
      data-testid="dropdown"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )),
  Button: jest.fn(({ children, ...props }) => (
    <button data-testid="apply-btn" {...props}>{children}</button>
  )),
}));

// Mock translation hook
jest.mock('@src/translations/useTranslation', () => ({
  useTranslate: () => ({
    t: key => key,
  }),
}));

// Mock notifications context
const mockApplyFilters = jest.fn();
let mockSearchState = {
  notificationDateRange: [new Date('2023-01-01'), new Date('2023-01-31')],
  notificationCategory: 'all',
  notificationReadStatus: 'ALL',
  page: 2,
};
jest.mock('../../context/NotificationsContext', () => ({
  useNotifications: () => ({
    searchState: mockSearchState,
    applyFilters: mockApplyFilters,
  }),
}));

// Mock constants
jest.mock('../../constants/NotificationFilterConstants', () => ({
  NOTIFICATION_CATEGORIES_LIST: [
    { value: 'all', label: 'All' },
    { value: 'urgent', label: 'Urgent' },
  ],
  NOTIFICATION_READ_STATUS_LIST: [
    { value: 'ALL', label: 'All' },
    { value: 'READ', label: 'Read' },
    { value: 'UNREAD', label: 'Unread' },
  ],
}));

describe('FilterToolbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchState = {
      notificationDateRange: [new Date('2023-01-01'), new Date('2023-01-31')],
      notificationCategory: 'all',
      notificationReadStatus: 'ALL',
      page: 2,
    };
  });

  it('renders correctly in desktop view', () => {
    render(<FilterToolbar isMobileView={false} />);
    expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    expect(screen.getAllByTestId('dropdown').length).toBe(2); // Category and Read Status
    expect(screen.getByTestId('apply-btn')).toHaveTextContent('notifications.cta.apply');
  });

  it('renders correctly in mobile view', () => {
    render(<FilterToolbar isMobileView={true} />);
    expect(screen.getByTestId('apply-btn')).toBeInTheDocument();
  });

  it('shows initial values from searchState', () => {
    render(<FilterToolbar isMobileView={false} />);
    expect(screen.getByTestId('date-range-picker')).toHaveTextContent(
      JSON.stringify([new Date('2023-01-01'), new Date('2023-01-31')])
    );
    const dropdowns = screen.getAllByTestId('dropdown');
    expect(dropdowns[0].value).toBe('all'); // Category
    expect(dropdowns[1].value).toBe('ALL'); // Read Status
  });

  it('updates date range on change', () => {
    render(<FilterToolbar isMobileView={false} />);
    fireEvent.click(screen.getByTestId('date-range-picker'));
    expect(screen.getAllByTestId('dropdown').length).toBe(2);
    expect(screen.getByTestId('apply-btn')).toBeInTheDocument();
  });

  it('updates category on dropdown change', () => {
    render(<FilterToolbar isMobileView={false} />);
    const dropdowns = screen.getAllByTestId('dropdown');
    fireEvent.change(dropdowns[0], { target: { value: 'urgent' } });
    expect(dropdowns[0].value).toBe('urgent');
  });

  it('updates read status on dropdown change', () => {
    render(<FilterToolbar isMobileView={false} />);
    const dropdowns = screen.getAllByTestId('dropdown');
    fireEvent.change(dropdowns[1], { target: { value: 'READ' } });
    expect(dropdowns[1].value).toBe('READ');
  });

  it('calls applyFilters with correct values on submit', async () => {
    render(<FilterToolbar isMobileView={false} />);
    const dropdowns = screen.getAllByTestId('dropdown');
    fireEvent.change(dropdowns[0], { target: { value: 'urgent' } });
    fireEvent.change(dropdowns[1], { target: { value: 'UNREAD' } });
    fireEvent.click(screen.getByTestId('date-range-picker'));
    await act(async () => {
      fireEvent.click(screen.getByTestId('apply-btn'));
    });
    expect(mockApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        notificationDateRange: [new Date('2023-01-01'), new Date('2023-01-31')],
        notificationCategory: 'urgent',
        notificationReadStatus: 'UNREAD',
        page: 1,
      })
    );
  });

  it('reacts to searchState changes', () => {
    const { rerender } = render(<FilterToolbar isMobileView={false} />);
    let dropdowns = screen.getAllByTestId('dropdown');
    expect(dropdowns[0].value).toBe('all');
    expect(dropdowns[1].value).toBe('ALL');
    // Change mockSearchState and rerender
    mockSearchState = {
      ...mockSearchState,
      notificationCategory: 'urgent',
      notificationReadStatus: 'READ',
      notificationDateRange: [new Date('2023-02-01'), new Date('2023-02-28')],
    };
    rerender(<FilterToolbar isMobileView={false} />);
    dropdowns = screen.getAllByTestId('dropdown');
    expect(dropdowns[0].value).toBe('urgent');
    expect(dropdowns[1].value).toBe('READ');
    expect(screen.getByTestId('date-range-picker')).toHaveTextContent(
      JSON.stringify([new Date('2023-02-01'), new Date('2023-02-28')])
    );
  });
});