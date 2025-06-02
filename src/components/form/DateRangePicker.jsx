import React from 'react';
import { DateRangePicker as BaseDateRangePicker } from '@mckesson/mcp-component-library';

export default function DateRangePicker({ minDate = new Date('-1'), maxDate = new Date(), onChange, value = [], dateFormat="MM/DD/YYYY", ...props }) {
  return (
    <BaseDateRangePicker
      dateRange={value}
      onChange={onChange}
      size="lg"
      isRequired={false}
      dateFormat={dateFormat}
      minDate={minDate}
      maxDate={maxDate}
      {...props}
    />
  );
}
