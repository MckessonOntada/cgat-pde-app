import React from 'react';
import { Field, useFormikContext } from 'formik';
import Components from '../form/Components';
import { gettenYearDate } from '@src/util/CommonUtils';

export default function AdditionalFilters({ filtersConfig }) { 
  const { values } = useFormikContext(); 
  const renderField = (item) => (
    <Field
      key={item.name}
      name={item.name}
      label={item.label}
      placeholder={item.placeholder}
      component={Components[item.type]}
      options={item.options}
      startDateLabel={item.startDateLabel}
      endDateLabel={item.endDateLabel}
      minDate={gettenYearDate(-15)}
      maxDate={gettenYearDate(15)}
      isRequired={item.required || false}
      {...item}
      {...(item.getUpdatedOptions
        ? { getUpdatedOptions: item.getUpdatedOptions }
        : {})}
      {...(item.selected ? { selected: item.selected } : {})}
    /> 
  );

  const baseFields = filtersConfig.map(renderField);
  const linkedFields = filtersConfig
    .flatMap((item) => item.linkedFilters?.(values[item.name] || '') || [])
    .map(renderField);

  return <div className="filterRow">{[...baseFields, ...linkedFields]}</div>;
}
