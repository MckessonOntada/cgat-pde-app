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
}));

describe('FilterToolbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchState = {
      notificationDateRange: [new Date('2023-01-01'), new Date('2023-01-31')],
      notificationCategory: 'all',
      page: 2,
    };
  });

  it('renders correctly in desktop view', () => {
    render(<FilterToolbar isMobileView={false} />);
    expect(screen.getByTestId('date-range-picker')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('apply-btn')).toHaveTextContent('notifications.cta.apply');
  });

  it('renders correctly in mobile view', () => {
    render(<FilterToolbar isMobileView={true} />);
    expect(screen.getByTestId('apply-btn')).toBeInTheDocument();
  });

  it('shows initial values from searchState', () => {
    render(<FilterToolbar isMobileView={false} />);
    // Compare stringified values for consistency
    expect(screen.getByTestId('date-range-picker')).toHaveTextContent(
      JSON.stringify([new Date('2023-01-01'), new Date('2023-01-31')])
    );
    expect(screen.getByTestId('dropdown').value).toBe('all');
  });

  it('updates date range on change', () => {
    render(<FilterToolbar isMobileView={false} />);
    fireEvent.click(screen.getByTestId('date-range-picker'));
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('apply-btn')).toBeInTheDocument();
  });

  it('updates category on dropdown change', () => {
    render(<FilterToolbar isMobileView={false} />);
    fireEvent.change(screen.getByTestId('dropdown'), { target: { value: 'urgent' } });
    expect(screen.getByTestId('dropdown').value).toBe('urgent');
  });

  it('calls applyFilters with correct values on submit', async () => {
    render(<FilterToolbar isMobileView={false} />);
    fireEvent.change(screen.getByTestId('dropdown'), { target: { value: 'urgent' } });
    fireEvent.click(screen.getByTestId('date-range-picker'));
    await act(async () => {
      fireEvent.click(screen.getByTestId('apply-btn'));
    });
    // Accept both Date objects and string values for notificationDateRange
    expect(mockApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        notificationDateRange: [new Date('2023-01-01'), new Date('2023-01-31')],
        notificationCategory: 'urgent',
        page: 1,
      })
    );
  });

  it('reacts to searchState changes', () => {
    const { rerender } = render(<FilterToolbar isMobileView={false} />);
    expect(screen.getByTestId('dropdown').value).toBe('all');
    // Change mockSearchState and rerender
    mockSearchState = {
      ...mockSearchState,
      notificationCategory: 'urgent',
      notificationDateRange: [new Date('2023-02-01'), new Date('2023-02-28')],
    };
    rerender(<FilterToolbar isMobileView={false} />);
    expect(screen.getByTestId('dropdown').value).toBe('urgent');
    expect(screen.getByTestId('date-range-picker')).toHaveTextContent(
      JSON.stringify([new Date('2023-02-01'), new Date('2023-02-28')])
    );
  });
});