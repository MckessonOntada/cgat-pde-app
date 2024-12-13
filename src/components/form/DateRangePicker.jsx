import React from 'react';
import { DateRangePicker as BaseDateRangePicker } from '@mckesson/mcp-component-library';

export default function DateRangePicker({
  minDate = new Date('-1'),
  maxDate = new Date(),
  onChange,
  value = [],
  ...props
}) {
  return (
    <BaseDateRangePicker
      dateRange={value}
      onChange={onChange}
      size="lg"
      minDate={minDate}
      maxDate={maxDate}
      {...props}
    />
  );
}
