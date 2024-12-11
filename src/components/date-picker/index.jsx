import React from 'react';
import styles from './DateRangePicker.module.scss';

const DateRangePicker = ({ onRangeChange, dateRange }) => {
  const { t } = useTranslate();
  const [startDate, setStartDate] = React.useState(dateRange?.[0] || '');
  const [endDate, setEndDate] = React.useState(dateRange?.[0] || '');

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    if (endDate && new Date(value) > new Date(endDate)) {
      setEndDate('');
    }
    onRangeChange && onRangeChange([value, endDate]);
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    if (new Date(value) >= new Date(startDate)) {
      setEndDate(value);
      onRangeChange && onRangeChange([startDate, value]);
    }
  };

  return (
    <div className={styles.wrapper}>
      <fieldset>
        <legend></legend>
        <div className={styles.controlWrapper}>
          <div className={styles.control}>
            <label htmlFor="start-date">Start Date:</label>
            <input id="start-date" type="date" value={startDate} onChange={handleStartDateChange} max={endDate || undefined} />
          </div>
          <div className={styles.control}>
            <label htmlFor="end-date">End Date:</label>
            <input id="end-date" type="date" value={endDate} onChange={handleEndDateChange} min={startDate || undefined} />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default DateRangePicker;
