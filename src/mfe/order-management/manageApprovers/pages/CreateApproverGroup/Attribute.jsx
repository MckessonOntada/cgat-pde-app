import React from 'react';
import { Field, FieldArray } from 'formik';
import { useTranslate } from '@src/translations/useTranslation';
import Components from '@src/components/form/Components';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import './index.scss';

import RenderControls from './RenderControls';

const Attributes = ({ values, errors, touched, handleChange }) => {
  const { t } = useTranslate();
  const attrOptions = [
    { label: t('orgManagement.create_org.option.please_select'), value: '' },
    {
      label: 'Catalog',
      value: 'Catalog'
    },
    {
      label: 'Account',
      value: 'Account'
    },
    {
      label: 'Price',
      value: 'Price'
    },
    {
      label: 'User',
      value: 'User'
    }
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
              <div key={index}>
                <div className="attributeBox">
                  <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start">
                    <Field
                      id={`rules[${index}].attributeType`}
                      name={`rules[${index}].attributeType`}
                      fieldlabel={t('approvergroup.attribute')}
                      placeholder=" "
                      component={Components['dropdown']}
                      isRequired
                      options={getAvailableOptions(index)}
                    />
                    <div className={`${attribute.attributeType === 'User' ? 'grid-column-4-by-1 sm:grid-column-1-by-1' : ''}`}>
                      <RenderControls attributeType={attribute.attributeType} index={index} name={`rules[${index}].value`} />
                    </div>
                    <div
                      className={`remove ${attribute.attributeType === 'User' ? 'grid-column-3-by-3 grid-row-1-by-1' : ''}}`}
                      style={attribute.attributeType === 'User' ? { gridRow: '1' } : {}}>
                      {index !== 0 && (
                        <Button
                          Icon={DeleteIcon}
                          variant="tertiary"
                          size="md"
                          label="REMOVE"
                          className="btnRemove"
                          onClick={() => remove(index)}></Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="separator-line"></div>
            <div className="addAttribute">
              <Button
                variant="tertiary"
                size="md"
                label="+ ADD ATTRIBUTE"
                onClick={() => push({ attributeType: '', value: '' })}
                disabled={isAddDisabled}></Button>
            </div>
          </>
        )}
      </FieldArray>
    </div>
  );
};

export default Attributes;
