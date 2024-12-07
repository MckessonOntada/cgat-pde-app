import React from 'react';
import { Field } from 'formik';
import { Button } from '@mckesson/mcp-component-library';
import Components from '../form/Components';
import { useTranslate } from '@src/translations/useTranslation';

export default function AdditionalFilters({ filtersConfig }) {
  const {t}  = useTranslate();
  return (
    <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
      {filtersConfig.map((item) => (
        <Field name={item.name} label={item.label} placeholder={item.placeholder} component={Components[item.type]} options={item.options} />
      ))}
      {/* Clear All filters button */}
      <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={()=>{}} />
    </div>
  );
}
