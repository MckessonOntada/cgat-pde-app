import Components from '@src/components/form/Components';
import React from 'react';
import './index.scss';
import { Field } from 'formik';
import { CONTROL_OPTIONS } from '../ApproverGroupDetail/RulesConfig';
import CommonUtils from '@src/util/CommonUtils';

const dataTransformers = {
  Material: (item) => ({
    label: item.label,
    value: item.value,
    channelType: item.channelType
  }),
  Account: (item) => ({
    label: item.label,
    value: item.value,
    channelType: item.channelType,
    name: item.label
  }),
  'User Role': (item) => ({
    label: item.name,
    value: item.value,
    name: item.name
  }),
  'User Name': (item) => ({
    label: item.label,
    value: item.value,
    name: item.name
  })
};

function mergeLists(values = [], list = [], attributeType) {
  const finalMap = new Map();
  const transformFn = dataTransformers[attributeType];

  for (const item of list) {
    finalMap.set(item.value, { ...transformFn(item), isChecked: false });
  }

  for (const item of values) {
    if (finalMap.has(item.value)) {
      finalMap.get(item.value).isChecked = true;
    } else {
      finalMap.set(item.value, { ...transformFn(item), isChecked: true });
    }
  }

  return Array.from(finalMap.values());
}

const AttributeFieldRenderer = ({ caption, helperText, attributeType, name, onSearch, localData, onRemoveClick, t, values, setFieldValue }) => {
  if (attributeType === CONTROL_OPTIONS.Price) {
    return (
      <div>
        <Field id="price" name={name} label={caption} placeholder=" " isRequired component={Components['input']} maxLength={8} />
        <div className="control-helper-text">{helperText}</div>
      </div>
    );
  } else {
    const placeholderText = {
      [CONTROL_OPTIONS.Material]: 'Search Therapy',
      [CONTROL_OPTIONS.Account]: 'Search Account',
      [CONTROL_OPTIONS['User Role']]: 'Search Role',
      [CONTROL_OPTIONS['User Name']]: 'Search User'
    }[attributeType];
    const index = values.rules.findIndex((rule) => rule.attributeType === attributeType);
    const controlValue = values.rules[index].value;

    return (
      <div>
        <Field
          id={attributeType}
          name={name}
          label={caption}
          placeholder={placeholderText}
          isRequired
          component={Components['multiSelectDropdown']}
          clearAllSelectedValues={() => {
            setFieldValue(`rules[${index}].value`, []);
          }}
          onChange={(value) => {
            const changedValues = value.filter((item) => item.isChecked);
            if (CommonUtils.isNonEmptyArray(changedValues) && !CommonUtils.areArraysUnique(changedValues, controlValue))
              setFieldValue(
                `rules[${index}].value`,
                value.filter((item) => item.isChecked)
              );
          }}
          options={mergeLists(controlValue, localData, attributeType)}
          onSearch={onSearch}
          onRemoveClick={onRemoveClick}
          noSelectedCountMessage={t('approvergroup.create.option.please_select')}
          pillsLabels={Array.isArray(controlValue) && controlValue.map((item) => ({ ...item, id: item.value, labelText: item.label }))}
          pillsCount={5}
          ispillsVisible={true}
          variant="async"
          recordsCountToEnableSearch={5}
          size="lg"
          asyncRecordsFound={localData?.length}
          isMultiSelect={true}
        />
        <div className="control-helper-text">{helperText}</div>
      </div>
    );
  }
};

export default AttributeFieldRenderer;
