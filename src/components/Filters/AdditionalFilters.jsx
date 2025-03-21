import React from 'react';
import { Field } from 'formik';
import Components from '../form/Components';
import { gettenYearDate } from '@src/util/CommonUtils';

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
          minDate={gettenYearDate(-15)}
          maxDate={gettenYearDate(15)}
          {...(item.getUpdatedOptions ? { getUpdatedOptions: item.getUpdatedOptions } : {})}
          {...(item.selected ? { selected: item.selected } : {})}
        />
      ))}
    </div>
  );
}
