import React, { useRef } from 'react';
import { Field, FieldArray } from 'formik';
import { useTranslate } from '@src/translations/useTranslation';
import Components from '@src/components/form/Components';
import { Button, Pills } from '@mckesson/mcp-component-library';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import './index.scss';
import RenderControls from './RenderControls';
import { RuleKeys, RuleLabels } from '../ApproverGroupDetail/RulesConfig';

const ruleAttributeConnectingSegment = {
  Catalog: 'ORDERED ANY OF',
  Price: 'GREATER THAN'
};

const Attributes = ({ values, setFieldValue }) => {
  const initRef = useRef(false);
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
              <div className="attribute-wrapper">
                <div key={index} className="attributeBox">
                  <div className="attribute-text-segment">IF</div>
                  <div className="type col-span-4">
                    <Field
                      id={`rules[${index}].attributeType`}
                      name={`rules[${index}].attributeType`}
                      fieldlabel={t('approvergroup.attribute') + ' ' + (index + 1)}
                      placeholder=" "
                      component={Components['dropdown']}
                      isRequired
                      helperText="Please select a criteria to apply the approval rules on."
                      options={getAvailableOptions(index)}
                      onChangeHandler={(value) => {
                        if (value === 'Users') {
                          setFieldValue('attributeuseroption', 'user_role');
                        }
                        if (value === 'Price') {
                          setFieldValue(`rules[${index}].value`, '');
                          setFieldValue(`rules[${index}].value_augmented`, '');
                        }
                      }}
                    />
                  </div>
                  <div className="attribute-text-segment">
                    {ruleAttributeConnectingSegment[attribute.attributeType] || 'SELECTED ANY OF'}
                  </div>
                  <div
                    className={`control ${
                      attribute.attributeType === RuleLabels[RuleKeys.USERS] ? 'col-span-12 grid-row-start-new' : 'col-span-8'
                    }`}>
                    <div className="dropdown-with-button">
                      <div className="dropdown-row">
                        <div className="dropdown-wrapper">
                          <RenderControls
                            attributeType={attribute.attributeType}
                            name={`rules[${index}].value`}
                            isAttributeRemoved={initRef}
                            helperText={'Please select the account(s) for the approver group.'}
                          />
                        </div>

                        {index !== 0 && (
                          <div className="remove-button">
                            <Button
                              Icon={DeleteIcon}
                              variant="tertiary"
                              size="md"
                              className="btnRemove"
                              onClick={() => {
                                remove(index);
                                initRef.current = true;
                              }}>
                              {t('approvergroup.button.remove')}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hr-container">
                  {index < values.rules.length - 1 && <div className="attribute-text-segment">AND</div>}
                  <hr className="hr-line" />
                </div>
              </div>
            ))}

            {/* Add Attribute Button */}

            {/* <div className="separator-line"></div> */}

            <div className="addAttribute">
              <Button
                variant="tertiary"
                size="md"
                onClick={() => {
                  push({ attributeType: '', value: '' });
                  // initRef.current = true;
                }}
                disabled={isAddDisabled}>
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
