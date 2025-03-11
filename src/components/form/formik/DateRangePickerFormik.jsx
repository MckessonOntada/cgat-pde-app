import React, { useEffect, useState } from 'react';
import DateRangePicker from '../DateRangePicker';
import { TextError } from '@mckesson/mcp-component-library';

export default function DateRangePickerFormik({ minDate, maxDate, ...props }) {
  const { field, form } = props;
  const [pickerMinDate, setPickerMinDate] = useState(minDate);
  const [resetKey, setResetKey] = useState(0);
  const onChange = (value) => {
    const min = value?.[0] || '';
    const max = value?.[1] || '';

    const prevMin = field?.value?.[0] || '';
    const prevMax = field?.value?.[1] || '';

    let error = '';
    const fromDate = min ? new Date(min) : null;
    const toDate = max ? new Date(max) : null;

    if (fromDate) {
      setPickerMinDate(fromDate);
    }

    if ((!fromDate && toDate) || (fromDate && !toDate)) {
      error = 'Select Both Dates.';
    } else if (fromDate && toDate && fromDate > toDate) {
      error = 'From/Start date must be before To/End date.';
    } else {
      error = '';
    }
    form.setFieldValue(field.name, [min || prevMin, max || prevMax]);
    form.setFieldError(field.name, error || undefined);
  };

  useEffect(() => {
    const fieldValue = form.values[field.name];
    if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.every((val) => !val))) {
      setPickerMinDate(minDate);
      if (JSON.stringify(fieldValue) !== JSON.stringify([null, null])) {
        form.setFieldValue(field.name, [null, null]);
        setResetKey((prevKey) => prevKey + 1);
      }
    }
  }, [form.values, field.name, minDate]);

  return (
    <div key={resetKey}>
      <DateRangePicker value={field.value || []} onChange={onChange} size="lg" minDate={pickerMinDate} maxDate={maxDate} {...props} />
      {form.errors[field.name] && <TextError errorMessage={form.errors[field.name]} />}
    </div>
  );
}
