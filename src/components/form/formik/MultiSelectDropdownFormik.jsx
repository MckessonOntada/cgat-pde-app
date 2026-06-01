import React from 'react';
import { getNestedValue } from '../util';
import MultiSelectDropdown from '../MultiSelectDropdown';
import { Pills } from '@mckesson/mcp-component-library';

const MultiSelectDropdownFormik = (props) => {
  const {
    field,
    form,
    fieldlabel,
    isRequired,
    getUpdatedOptions = () => {},
    ispillsVisible = false,
    pillsCount = null,
    pillsLabels = [],
    onRemoveClick = () => {},
    onChange: externalOnChange,
    ...rest
  } = props;
  const { name, value } = field;
  const { setFieldValue, setFieldTouched, errors, touched } = form;
  const errorMessage = getNestedValue(errors, name);
  const isFieldTouched = getNestedValue(touched, name);
  return (
    <div>
      <MultiSelectDropdown
        id={name}
        label={fieldlabel}
        isSuccess
        value={value}
        error={isFieldTouched && errorMessage}
        isRequired={isRequired}
        onChange={(values) => {
          if (externalOnChange) {
            externalOnChange(values);
          } else {
            const augmentedData = values
              .filter((item) => item.isChecked)
              .map((item) => ({
                name: item.label,
                value: item.value
              }));

            setFieldValue(`${name}_augmented`, augmentedData);

            setFieldValue(
              `${name}`,
              values.filter((item) => item.isChecked).map((item) => item.value)
            );

            getUpdatedOptions(values);
          }
          setFieldTouched(name, true, false);
        }}
        {...rest}
      />
      {ispillsVisible && value.length > 0 && (
        <div className="pills-container">
          <Pills id={`pills-${name}`} labels={pillsLabels} variant="secondary" hasDeleteIcon onDelete={onRemoveClick} showPillsCount={pillsCount} />
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdownFormik;
