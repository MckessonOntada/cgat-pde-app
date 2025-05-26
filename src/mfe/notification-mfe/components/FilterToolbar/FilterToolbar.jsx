import React, { useRef, useEffect, useState } from 'react';

// External component library imports
import { DateRangePicker, Dropdown, Button } from '@mckesson/mcp-component-library';

// Styles
import styles from './FilterToolbar.module.scss';

// Hooks and context
import { useTranslate } from '@src/translations/useTranslation';
import { useNotifications } from '../../context/NotificationsContext';

// Formik for form state management
import { Formik, Form } from 'formik';
import { NOTIFICATION_CATEGORIES_LIST } from '../../constants/NotificationFilterConstants';

/**
 * FilterToolbar component
 * Provides date range and category filtering for notifications.
 * Responsive to mobile and desktop views.
 */
/**
 * FilterToolbar component provides filtering controls for notifications, including a date range picker and category dropdown.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.isMobileView - Determines if the toolbar should render in mobile view mode.
 *
 * @returns {JSX.Element} The rendered filter toolbar with date range and category filters.
 *
 * @example
 * <FilterToolbar isMobileView={false} />
 *
 * @remarks
 * - Uses Formik for form state management.
 * - Date range is limited to the last 90 days.
 * - On filter change, resets the page to 1 in the search state.
 */
const FilterToolbar = ({ isMobileView }) => {
  // Translation hook
  const { t } = useTranslate();

  // Responsive element size
  const elementSize = isMobileView ? 'sm' : 'md';

  // Ref for the form element
  const formRef = useRef(null);

  // Notification context: search state
  const { searchState, setSearchState } = useNotifications();

  // --- Date Range State Management ---

  // Minimum selectable date (90 days before today or end date)
  const [minDate, setMinDate] = useState(() => {
    const min = new Date();
    min.setDate(min.getDate() - 90);
    min.setHours(0, 0, 0, 0);
    return min;
  });

  // Maximum selectable date (today)
  const [maxDate, setMaxDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  // Local state for the date range picker (keeps in sync with searchState)
  const [localDateRange, setLocalDateRange] = useState(searchState.notificationDateRange);

  // Sync localDateRange with searchState changes
  useEffect(() => {
    setLocalDateRange(searchState.notificationDateRange);
  }, [searchState.notificationDateRange]);

  // Update minDate and maxDate based on selected date range
  useEffect(() => {
    const dateRange = localDateRange;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let min;
    let endDate = Array.isArray(dateRange) ? dateRange[1] : null;

    if (endDate) {
      const end = endDate instanceof Date ? endDate : new Date(endDate);
      if (!isNaN(end)) {
        min = new Date(end);
        min.setDate(min.getDate() - 90);
        min.setHours(0, 0, 0, 0);
      } else {
        min = new Date(today);
        min.setDate(min.getDate() - 90);
        min.setHours(0, 0, 0, 0);
      }
    } else {
      min = new Date(today);
      min.setDate(min.getDate() - 90);
      min.setHours(0, 0, 0, 0);
    }

    setMinDate(min);
    setMaxDate(today);
  }, [localDateRange]);

  // --- Render ---

  return (
    <Formik
      initialValues={{
        notificationDateRange: localDateRange,
        notificationCategory: searchState.notificationCategory
      }}
      enableReinitialize
      // On form submit, update search state and reset page
      onSubmit={(values) => {
        setSearchState((prevState) => ({
          ...prevState,
          notificationDateRange: values.notificationDateRange,
          notificationCategory: values.notificationCategory,
          page: 1 // Reset page on filter change
        }));
      }}>
      {({ values, setFieldValue }) => (
        <Form ref={formRef} autoComplete="off" className={styles.filterForm}>
          <div className={styles.filterToolbar}>
            {/* Date Range Picker */}
            <div className={styles.dateFilter}>
              <DateRangePicker
                id="notification-filter-date-range"
                dateRange={values.notificationDateRange}
                onChange={(dateRange) => {
                  setFieldValue('notificationDateRange', dateRange);
                  setLocalDateRange(dateRange);
                }}
                size={elementSize}
                isRequired={false}
                dateFormat="MM/DD/YYYY"
                maxDate={maxDate}
                minDate={minDate}
              />
            </div>

            {/* Category Dropdown */}
            <div className={styles.dropdownFilter}>
              <Dropdown
                id="notification-filter-category"
                options={NOTIFICATION_CATEGORIES_LIST}
                value={values.notificationCategory}
                label={t('notification.category')}
                onChange={(value) => setFieldValue('notificationCategory', value)}
                size={elementSize}
              />
            </div>

            {/* Apply Button */}
            <div className={styles.filterCta}>
              <Button size={elementSize} variant="secondary" type="submit" buttonWidth={isMobileView ? '100%' : 'auto'}>
                {t('notifications.cta.apply')}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FilterToolbar;
