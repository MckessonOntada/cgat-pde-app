import Components from '@src/components/form/Components';
import React from 'react';
import './index.scss';
import { Field } from 'formik';
import { RuleKeys, RuleLabels } from '../ApproverGroupDetail/RulesConfig';
import { createLabelData } from './formUtils';

const getAugmentedValues = (rules, attributeType) => {
  return rules.filter((rule) => rule.attributeType === attributeType).flatMap((rule) => rule.value_augmented || []);
};

const AttributeFieldRenderer = ({ attributeType, name, localData, setLocalData, onRemoveClick, t, values }) => {
  const userRadioOptions = [
    { isDisabled: false, label: t('approvergroup.userrole'), value: 'user_role' },
    { isDisabled: false, label: t('approvergroup.username'), value: 'user_name' }
  ];
  switch (attributeType) {
    case RuleLabels[RuleKeys.PRICE]:
      return (
        <div>
          <Field
            id="price"
            name={name}
            label={t('approvergroup.price')}
            placeholder=" "
            isRequired
            component={Components['input']}
            maxLength={8}
          />
        </div>
      );

    case RuleLabels[RuleKeys.THERAPIES]:
      return (
        <div className="grid grid-gap-16 grid-cols-1">
          <Field
            id={RuleLabels[RuleKeys.THERAPIES]}
            name={name}
            label={t('approvergroup.selecttherapy')}
            placeholder=" "
            isRequired
            component={Components['multiSelectDropdown']}
            options={localData}
            getUpdatedOptions={setLocalData}
            onRemoveClick={onRemoveClick}
            noSelectedCountMessage={t('approvergroup.create.option.please_select')}
            pillsLabels={createLabelData(getAugmentedValues(values.rules, attributeType))}
            pillsCount={5}
            ispillsVisible={true}
          />
        </div>
      );

    case RuleLabels[RuleKeys.ACCOUNTS]:
      return (
        <div className="grid grid-gap-16 grid-cols-1">
          <Field
            id={RuleLabels[RuleKeys.ACCOUNTS]}
            name={name}
            label={t('approvergroup.selectaccount')}
            placeholder=" "
            isRequired
            component={Components['multiSelectDropdown']}
            options={localData}
            getUpdatedOptions={setLocalData}
            onRemoveClick={onRemoveClick}
            noSelectedCountMessage={t('approvergroup.create.option.please_select')}
            pillsLabels={createLabelData(getAugmentedValues(values.rules, attributeType))}
            pillsCount={5}
            ispillsVisible={true}
          />
        </div>
      );

    case RuleLabels[RuleKeys.USERS]:
      return (
        <div className="grid grid-gap-24">
          <Field
            id="User"
            name="attributeuseroption"
            caption={t('approvergroup.selectuserradio')}
            placeholder=" "
            component={Components['radioGroup']}
            isRequired
            items={userRadioOptions}
            breakItemLabel={false}
            itemCustomStyles={{ fontSize: '16px', marginRight: '24px' }}
            labelCustomStyles={{ marginBottom: '8px', fontSize: '16px' }}
            value={values.attributeuseroption}
          />
          <Field
            id={RuleLabels[RuleKeys.ACCOUNTS]}
            name={name}
            label={t('approvergroup.selectuser')}
            placeholder=" "
            isRequired
            component={Components['multiSelectDropdown']}
            options={localData}
            getUpdatedOptions={setLocalData}
            onRemoveClick={onRemoveClick}
            noSelectedCountMessage={t('approvergroup.create.option.please_select')}
            pillsLabels={createLabelData(getAugmentedValues(values.rules, attributeType))}
            pillsCount={7}
            ispillsVisible={true}
          />
        </div>
      );

    default:
      return null;
  }
};

export default AttributeFieldRenderer;
