import React, { useRef, useEffect, useState } from 'react';
import { DateRangePicker, Dropdown, Button } from '@mckesson/mcp-component-library';
import styles from './FilterToolbar.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { useNotifications } from '../../context/NotificationsContext';
import { Formik, Form } from 'formik';

const FilterToolbar = ({ isMobileView }) => {
  const { t } = useTranslate();
  const elementSize = isMobileView ? 'sm' : 'md';
  const formRef = useRef(null);
  const { dropdownOptions, filterState, setFilterState } = useNotifications();

  // State for minDate and maxDate
  const [minDate, setMinDate] = useState(() => {
    const min = new Date();
    min.setDate(min.getDate() - 90);
    min.setHours(0, 0, 0, 0);
    return min;
  });
  const [maxDate, setMaxDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [localDateRange, setLocalDateRange] = useState(filterState.notificationDateRange);

  useEffect(() => {
    setLocalDateRange(filterState.notificationDateRange);
  }, [filterState.notificationDateRange]);

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

  return (
    <Formik
      initialValues={{
        notificationDateRange: localDateRange,
        notificationCategory: filterState.notificationCategory
      }}
      enableReinitialize
      onSubmit={(values) => {
        setFilterState((prevState) => ({
          ...prevState,
          notificationDateRange: values.notificationDateRange,
          notificationCategory: values.notificationCategory
        }));
      }}
    >
      {({ values, setFieldValue }) => (
        <Form ref={formRef} autoComplete="off" className={styles.filterForm}>
          <div className={styles.filterToolbar}>
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
            <div className={styles.dropdownFilter}>
              <Dropdown
                id="notification-filter-category"
                options={dropdownOptions}
                value={values.notificationCategory}
                label={t('notification.category')}
                onChange={(value) => setFieldValue('notificationCategory', value)}
                size={elementSize}
              />
            </div>
            <div className={styles.filterCta}>
              <Button size={elementSize} variant="secondary" type="submit">
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
