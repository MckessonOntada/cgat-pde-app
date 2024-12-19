import React from 'react';
import { DateRangePicker as BaseDateRangePicker } from '@mckesson/mcp-component-library';

export default function DateRangePicker({ minDate = new Date('-1'), maxDate = new Date(), ...props }) {
    const { field, form } = props;

    const onChange = (value) => {
      const min = value?.[0] || "";
      const max = value?.[1] || "";

      const prevMin = field?.value?.[0] || "";
      const prevMax = field?.value?.[1] || "";
      form.setFieldValue(field.name, [min || prevMin, max || prevMax])
    };

  return <BaseDateRangePicker dateRange={field.value || []} onChange={onChange} size="lg" minDate={minDate} maxDate={maxDate} {...props}/>;
}