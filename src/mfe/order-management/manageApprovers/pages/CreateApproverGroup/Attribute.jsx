import React, { useRef } from 'react';
import { Field, FieldArray } from 'formik';
import { useTranslate } from '@src/translations/useTranslation';
import Components from '@src/components/form/Components';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import './index.scss';
import RenderControls from './RenderControls';
import { CONTROL_OPTIONS } from '../ApproverGroupDetail/RulesConfig';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';

const ruleAttributeConnectingSegment = {
  Catalog: 'ORDERED ANY OF',
  Price: 'GREATER THAN',
  Account: 'SELECTED ANY OF',
  Roles: 'SELECTED ANY OF',
  Users: 'SELECTED ANY OF'
};

const Attributes = ({ values, setFieldValue }) => {
  const initRef = useRef(false);
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const attrOptions = [
    { label: t('orgManagement.create_org.option.please_select'), value: '' },
    ...Object.entries(CONTROL_OPTIONS).map(([key, value]) => ({
      label: value,
      value: key
    }))
  ];

  const isAddDisabled = values.rules.length >= attrOptions.length - 1;
  const getAvailableOptions = (index) => {
    const selectedValues = values.rules.map((attr) => attr.attributeType);
    return attrOptions.filter(
      (option) => option.value === '' || !selectedValues.includes(option.value) || values.rules[index]?.attributeType === option.value
    );
  };

  const confirmOnDelete = () => {
    const onDelete = () => {
      remove(index);
      initRef.current = true;
    };

    const state = {};
    state.title = `Delete Rule?`;
    state.body = (
      <div className="MCP-modal-body">
        <p>Do you want to delete this rule?</p>
      </div>
    );
    state.footer = (
      <div className="controls">
        <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
          {t('button.caption.no')}
        </Button>
        <Button size="md" variant="primary" onClick={onDelete}>
          {t('button.caption.yes')}
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  return (
    <div>
      <FieldArray name="rules">
        {({ push, remove }) => (
          <>
            <div className="rule-list">
              {values.rules?.map((attribute, index) => (
                <div className="rule">
                  <div key={index} className="rule-wrapper">
                    <div className="condition attribute-text-segment">IF</div>
                    <div className="control type">
                      <Field
                        id={`rules[${index}].attributeType`}
                        name={`rules[${index}].attributeType`}
                        fieldlabel={t('approvergroup.attribute') + ' ' + (index + 1)}
                        placeholder=" "
                        component={Components['dropdown']}
                        isRequired
                        options={getAvailableOptions(index)}
                        onChangeHandler={(value) => {
                          setFieldValue(`rules[${index}].attributeType`, value);
                          // if (value === 'Users') {
                          //   setFieldValue('attributeuseroption', 'user_role');
                          // }
                          // if (value === 'Price') {
                          //   setFieldValue(`rules[${index}].value`, '');
                          //   setFieldValue(`rules[${index}].value_augmented`, '');
                          // }
                        }}
                      />
                      <div className="control-helper-text">Please select a criteria to apply the approval rules on.</div>
                    </div>
                    <div className="clause attribute-text-segment">{ruleAttributeConnectingSegment[attribute.attributeType]}</div>
                    <div className={`response-control ${attribute.attributeType === CONTROL_OPTIONS['Price'] ? 'price' : ''}`}>
                      <div className="dropdown-with-button">
                        <div className="dropdown-row">
                          <div className="dropdown-wrapper">
                            <RenderControls
                              attributeType={attribute.attributeType}
                              name={`rules[${index}].value`}
                              isAttributeRemoved={initRef}
                            />
                          </div>

                          {index !== 0 && (
                            <div className="remove-button">
                              <Button Icon={DeleteIcon} variant="tertiary" size="md" className="btnRemove" onClick={confirmOnDelete}>
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
            </div>

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
