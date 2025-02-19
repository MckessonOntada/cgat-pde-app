import Components from '@src/components/form/Components';
import React from 'react';
import './index.scss';
import { Field } from 'formik';
import { CONTROL_OPTIONS } from '../ApproverGroupDetail/RulesConfig';
import { createLabelData } from './formUtils';

const getAugmentedValues = (rules, attributeType) => {
  return rules.filter((rule) => rule.attributeType === attributeType).flatMap((rule) => rule.value_augmented || []);
};

const AttributeFieldRenderer = ({ caption, helperText, attributeType, name, localData, setLocalData, onRemoveClick, t, values }) => {
  switch (attributeType) {
    case CONTROL_OPTIONS.PRICE.toUpperCase():
      return (
        <div>
          <Field id="price" name={name} label={caption} placeholder=" " isRequired component={Components['input']} maxLength={8} />
          <div className="control-helper-text">{helperText}</div>
        </div>
      );

    case CONTROL_OPTIONS.CATALOG.toUpperCase():
    case CONTROL_OPTIONS.ACCOUNT.toUpperCase():
      return (
        <div>
          <Field
            id={attributeType}
            name={name}
            label={caption}
            placeholder=" "
            isRequired
            component={Components['multiSelectDropdown']}
            options={localData}
            getUpdatedOptions={(values) => {
              if (values.length > 0) {
                setLocalData(values);
              }
            }}
            onRemoveClick={onRemoveClick}
            noSelectedCountMessage={t('approvergroup.create.option.please_select')}
            pillsLabels={createLabelData(getAugmentedValues(values.rules, attributeType))}
            pillsCount={5}
            ispillsVisible={true}
          />
          <div className="control-helper-text">{helperText}</div>
        </div>
      );

    case CONTROL_OPTIONS.USER_ROLE.toUpperCase().replace(/\s/g, '_'):
    case CONTROL_OPTIONS.USER_NAME.toUpperCase().replace(/\s/g, '_'):
      return (
        <div>
          <Field
            id={attributeType}
            name={name}
            label={caption}
            placeholder=" "
            isRequired
            component={Components['multiSelectDropdown']}
            options={localData}
            getUpdatedOptions={(values) => {
              if (values.length > 0) {
                setLocalData(values);
              }
            }}
            onRemoveClick={onRemoveClick}
            noSelectedCountMessage={t('approvergroup.create.option.please_select')}
            pillsLabels={createLabelData(getAugmentedValues(values.rules, attributeType))}
            pillsCount={7}
            ispillsVisible={true}
          />
          <div className="control-helper-text">{helperText}</div>
        </div>
      );

    default:
      return null;
  }
};

export default AttributeFieldRenderer;
