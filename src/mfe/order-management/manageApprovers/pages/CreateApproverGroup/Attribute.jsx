import React from 'react';
import { Field, FieldArray } from 'formik';
import { useTranslate } from '@src/translations/useTranslation';
import Components from '@src/components/form/Components';
import { Button, Pills } from '@mckesson/mcp-component-library';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import './index.scss';
import RenderControls from './RenderControls';
import { RuleKeys, RuleLabels } from '../ApproverGroupDetail/RulesConfig';

const Attributes = ({ values, setFieldValue }) => {
  const { t } = useTranslate();
  const attrOptions = [
    { label: t('orgManagement.create_org.option.please_select'), value: '' },
    ...Object.entries(RuleLabels)
      .filter(([key]) => key !== RuleKeys.ROLES)
      .map(([, label]) => ({
        label,
        value: label
      }))
  ];

  const isAddDisabled = values.rules.length >= attrOptions.length - 1;
  const getAvailableOptions = (index) => {
    const selectedValues = values.rules.map((attr) => attr.attributeType);
    return attrOptions.filter(
      (option) => option.value === '' || !selectedValues.includes(option.value) || values.rules[index]?.attributeType === option.value
    );
  };

  return (
    <div>
      <FieldArray name="rules">
        {({ push, remove }) => (
          <>
            {values.rules?.map((attribute, index) => (
              <div key={index} className="attributeBox grid grid-gap-24 grid-cols-12 gap-4 align-items-start">
                <div className="col-span-4">
                  <Field
                    id={`rules[${index}].attributeType`}
                    name={`rules[${index}].attributeType`}
                    fieldlabel={t('approvergroup.attribute')}
                    placeholder=" "
                    component={Components['dropdown']}
                    isRequired
                    options={getAvailableOptions(index)}
                    onChangeHandler={(value) => {
                      setFieldValue('attributeuseroption', 'user_role');
                      setFieldValue(`rules[${index}].value`, value === 'Price' ? '' : []);
                      setFieldValue(`rules[${index}].value_augmented`, value === 'Price' ? '' : []);
                    }}
                  />
                </div>
                <div
                  className={`${attribute.attributeType === RuleLabels[RuleKeys.USERS] ? 'col-span-12 grid-row-start-new' : 'col-span-8'}`}>
                  <div className="dropdown-with-button">
                    <div className="dropdown-row">
                      <div className="dropdown-wrapper">
                        <RenderControls attributeType={attribute.attributeType} name={`rules[${index}].value`} />
                      </div>

                      <div className="remove-button">
                        {index !== 0 && (
                          <Button Icon={DeleteIcon} variant="tertiary" size="md" className="btnRemove" onClick={() => remove(index)}>
                            {t('approvergroup.button.remove')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Attribute Button */}
            <div className="separator-line"></div>
            <div className="addAttribute">
              <Button variant="tertiary" size="md" onClick={() => push({ attributeType: '', value: '' })} disabled={isAddDisabled}>
                + {t('approvergroup.addattribute')}
              </Button>
            </div>
          </>
        )}
      </FieldArray>
    </div>
  );
};

export default Attributes;
