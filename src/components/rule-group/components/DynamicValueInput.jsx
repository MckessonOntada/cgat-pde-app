import React from 'react';
import { Field, useFormikContext } from 'formik';
import Components from '@src/components/form/Components';
import MultiSelectDropdown from '../inputs/MultiSelectDropdown';

export default function DynamicValueInput(props) {
  const {
    index,
    label,
    isRequired = true,
    length: maxLength,
    type,
    helperText,
    searchFn,
    pillListerFn,
    noSelectedCountMessage = 'No Selected Count Message'
  } = props;
  const { values, setFieldValue } = useFormikContext();
  const selectedValues = values.rules[index].value || [];

  const isSearch = type === 'search';

  const fieldProps = React.useMemo(() => {
    const fp = {
      id: `rules[${index}].value`,
      name: `rules[${index}].value`,
      label,
      maxLength,
      isRequired
    };

    if (type === 'text' || type === 'number') {
      fp.component = Components['input'];
    } else if (isSearch) {
      fp.noSelectedCountMessage = noSelectedCountMessage;
      fp.component = MultiSelectDropdown;
      fp.variant = 'async';
      fp.isMultiSelect = true;
      fp.searchFn = searchFn;
      fp.pillsLabels = pillListerFn && selectedValues ? selectedValues.map(pillListerFn) : [];
      fp.pillsCount = 5;
      fp.isPillsVisible = true;
      fp.onRemoveClick = (id) => {
        const filtered = selectedValues.filter((item) => item.value !== id);
        setFieldValue(`rules[${index}].value`, filtered);
      };
    }

    return fp;
  }, [type, selectedValues]);

  const gridClass = isSearch
    ? 'grid grid-gap-24 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1'
    : 'grid grid-gap-24 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2';

  return (
    <>
      <div className={gridClass}>
        <Field {...fieldProps} />
      </div>
      <div className="control-helper-text">{helperText}</div>
    </>
  );
}
