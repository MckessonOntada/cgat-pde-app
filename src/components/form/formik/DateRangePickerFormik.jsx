import React from 'react';
import DateRangePicker from '../DateRangePicker';

export default function DateRangePickerFormik({ minDate = new Date('-1'), maxDate = new Date(), ...props }) {
  const { field, form } = props;

  const onChange = (value) => {
    const min = value?.[0] || '';
    const max = value?.[1] || '';

    const prevMin = field?.value?.[0] || '';
    const prevMax = field?.value?.[1] || '';
    form.setFieldValue(field.name, [min || prevMin, max || prevMax]);
  };

  return (
    <DateRangePicker value={field.value || []} onChange={onChange} size="lg" minDate={minDate} maxDate={maxDate} />
  );
}
