import React from 'react';
import '../Components.scss';
import ToggleButton from '@src/components/toggle-button/ToggleButton';

export default function ToggleButtonFieldFormik(props) {
  const { field, form, options, isRequired, ...rest } = props;
  const { name, value = options[0] } = field;
  const { setFieldValue } = form;

  const handleOnChange = (value) => {
    if (typeof props.onChange === 'function') {
      props.onChange(value);
    }
    setFieldValue(`${name}`, value);
  };

  return <ToggleButton name={name} options={options} value={value} onChange={handleOnChange} isRequired={isRequired} {...rest} />;
}
