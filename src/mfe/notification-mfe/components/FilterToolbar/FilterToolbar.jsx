import React, { useRef } from 'react';
import {
  DateRangePicker,
  Dropdown,
  Button
} from '@mckesson/mcp-component-library';
import styles from './FilterToolbar.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { useNotifications } from '../../context/NotificationsContext';
import { Formik, Form } from 'formik';

const FilterToolbar = ({ isMobileView }) => {
  const { t } = useTranslate();
  const elementSize = isMobileView ? 'sm' : 'md';
  const formRef = useRef(null);
  const { dropdownOptions, filterState, setFilterState } = useNotifications();

  return (
    <Formik
      initialValues={{
        notificationDateRange: filterState.notificationDateRange,
        notificationDropdownValue: filterState.notificationDropdownValue
      }}
      enableReinitialize
      onSubmit={(values) => {
        setFilterState((prevState) => ({
          ...prevState,
          notificationDateRange: values.notificationDateRange,
          notificationDropdownValue: values.notificationDropdownValue
        }));
      }}>
      {({ values, setFieldValue }) => (
        <Form ref={formRef} autoComplete="off" className={styles.filterForm}>
          <div className={styles.filterToolbar}>
            <div className={styles.dateFilter}>
              <DateRangePicker
                id="notification-filter-date-range"
                dateRange={values.notificationDateRange}
                onChange={(dateRange) =>
                  setFieldValue('notificationDateRange', dateRange)
                }
                size={elementSize}
                isRequired={false}
              />
            </div>
            <div className={styles.dropdownFilter}>
              <Dropdown
                id="notification-filter-dropdown"
                options={dropdownOptions}
                value={values.notificationDropdownValue}
                onChange={(value) =>
                  setFieldValue('notificationDropdownValue', value)
                }
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
