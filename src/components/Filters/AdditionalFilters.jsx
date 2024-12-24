import React from 'react';
import { Field } from 'formik';
import Components from '../form/Components';

export default function AdditionalFilters({ filtersConfig}) {
  return (
    <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {filtersConfig.map((item) => (
        <Field name={item.name} label={item.label} placeholder={item.placeholder} component={Components[item.type]} options={item.options} startDateLabel={item.startDateLabel} endDateLabel={item.endDateLabel} />
      ))}
    </div>
  );
}
