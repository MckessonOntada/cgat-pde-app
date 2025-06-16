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
import { NOTIFICATION_CATEGORIES_LIST, NOTIFICATION_READ_STATUS_LIST } from '../../constants/NotificationFilterConstants';

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
  const { searchState, applyFilters } = useNotifications();

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

    let min = new Date(today);
    min.setDate(min.getDate() - 90);
    min.setHours(0, 0, 0, 0);

    let startDate = Array.isArray(dateRange) ? dateRange[0] : null;
    let endDate = Array.isArray(dateRange) ? dateRange[1] : null;

    // Only set minDate based on endDate if endDate is a valid date and within allowed range
    if (endDate) {
      const end = endDate instanceof Date ? endDate : new Date(endDate);
      if (!isNaN(end)) {
        // endDate must not be after today and not before min
        if (end <= today && end >= min) {
          min = new Date(end);
          min.setDate(min.getDate() - 90);
          min.setHours(0, 0, 0, 0);
        }
      }
    }
    setMinDate(min);
    setMaxDate(today);
  }, [localDateRange]);

  // --- Render ---

  // Formik validation function for the whole form
  const validate = (values) => {
    const errors = {};
    const [startDate, endDate] = values.notificationDateRange || [];

    // Helper to format date as MM/DD/YYYY
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    };

    // Use actual Date objects for comparison
    const min = minDate;
    const max = maxDate;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Both start and end must be valid
    if (!start || isNaN(start) || !end || isNaN(end)) {
      errors.notificationDateRange = t('notification.filter.dateRange.rangeError');
    } else if (start < min) {
      errors.notificationDateRange = t('notification.filter.dateRange.rangeError');
    } else if (end > max) {
      errors.notificationDateRange = t('notification.filter.dateRange.rangeError');
    } else if (start > end) {
      errors.notificationDateRange = t('notification.filter.dateRange.rangeError');
    }
    return errors;
  };

  return (
    <Formik
      initialValues={{
        notificationDateRange: localDateRange,
        notificationCategory: searchState.notificationCategory,
        notificationReadStatus: searchState.notificationReadStatus // <-- Added
      }}
      enableReinitialize
      validate={validate}
      // On form submit, update search state and reset page
      onSubmit={(values) => {
        applyFilters({
          ...searchState,
          notificationDateRange: values.notificationDateRange,
          notificationCategory: values.notificationCategory,
          notificationReadStatus: values.notificationReadStatus, // <-- Added
          page: 1 // Reset page on filter change
        });
      }}>
      {({ values, setFieldValue, errors, touched }) => (
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
                  // Immediately validate after value change
                  setTimeout(() => {
                    // Formik's validateForm will re-run validation
                    if (formRef.current && formRef.current.dispatchEvent) {
                      // Trigger a synthetic change event to force validation
                      const event = new Event('change', { bubbles: true });
                      formRef.current.dispatchEvent(event);
                    }
                  }, 0);
                }}
                size={elementSize}
                isRequired={false}
                dateFormat="MM/DD/YYYY"
                maxDate={maxDate}
                minDate={minDate}
                isStartDateError={!!errors.notificationDateRange}
                isEndDateError={!!errors.notificationDateRange}
              />
              {/* Show Formik error for date range only if error is present and the user has interacted with the field */}
              {errors.notificationDateRange && <div className={styles.errorMessage}>{errors.notificationDateRange}</div>}
            </div>

            {/* Read Status Dropdown */}
            <div className={styles.dropdownFilter}>
              <Dropdown
                id="notification-filter-read-status"
                options={NOTIFICATION_READ_STATUS_LIST}
                value={values.notificationReadStatus}
                label={t('notification.readStatus')}
                onChange={(value) => setFieldValue('notificationReadStatus', value)}
                size={elementSize}
              />
              {errors.notificationDateRange && (
                <div className={styles.errorMessage}>
                  {' '}
                  <span className={styles.emptyErrorPlaceholder}></span>
                </div>
              )}
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
              {errors.notificationDateRange && (
                <div className={styles.errorMessage}>
                  {' '}
                  <span className={styles.emptyErrorPlaceholder}></span>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <div className={styles.filterCta}>
              <Button
                size={elementSize}
                variant="secondary"
                type="submit"
                buttonWidth={isMobileView ? '100%' : 'auto'}
                disabled={!!errors.notificationDateRange}>
                {t('notifications.cta.apply')}
              </Button>
              {errors.notificationDateRange && (
                <div className={styles.errorMessage}>
                  {' '}
                  <span className={styles.emptyErrorPlaceholder}></span>
                </div>
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FilterToolbar;
