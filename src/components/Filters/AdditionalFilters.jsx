import React from 'react';
import { Field } from 'formik';
import Components from '../form/Components';

export default function AdditionalFilters({ filtersConfig }) {
  return (
    <div className="filterRow">
      {filtersConfig.map((item) => (
        <Field
          name={item.name}
          label={item.label}
          placeholder={item.placeholder}
          component={Components[item.type]}
          options={item.options}
          startDateLabel={item.startDateLabel}
          endDateLabel={item.endDateLabel}
          minDate={item.minDate}
          maxDate={item.maxDate}
          {...(item.getUpdatedOptions ? { getUpdatedOptions: item.getUpdatedOptions } : {})}
        />
      ))}
    </div>
  );
}
