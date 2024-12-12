import React from 'react';
import { Field, FieldArray } from 'formik';
import { useTranslate } from '@src/translations/useTranslation';
import Components from '@src/components/form/Components';
import { RadioGroup, Button } from '@mckesson/mcp-component-library';
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
  const isAddDisabled = values.attributes.length >= attrOptions.length - 1;
  const getAvailableOptions = (index) => {
    const selectedValues = values.attributes.map((attr) => attr.attributeType);
    return attrOptions.filter(
      (option) => option.value === '' || !selectedValues.includes(option.value) || values.attributes[index]?.attributeType === option.value
    );
  };
  const renderControl = (attributeType, index) => {
    const getRadioItemStyles = () => {
      let styles = { fontSize: '16px', marginRight: '24px' };

      return styles;
    };

    switch (attributeType) {
      case 'Price':
        return (
          <div>
            <Field
              id="price"
              name="price"
              label={t('approvergroup.price')}
              placeholder=" "
              isRequired
              component={Components['input']}
              maxLength={50}
            />
          </div>
        );
      case 'Catalog':
        return (
          <div>
            <Field
              name="attribute1"
              fieldlabel={t('approvergroup.selecttherapy')}
              placeholder=" "
              component={Components['multiSelectDropdown']}
              isRequired
              options={data}
            />
          </div>
        );
      case 'Account':
        return (
          <div>
            <Field
              name="attribute1"
              fieldlabel={t('approvergroup.selectaccount')}
              placeholder=" "
              component={Components['multiSelectDropdown']}
              isRequired
              options={data}
            />
          </div>
        );

      case 'User':
        return (
          <div className="grid grid-gap-24">
            <div>
              <Field
                name="attributeuseroption"
                caption={t('approvergroup.selectuserradio')}
                placeholder=" "
                component={Components['radioGroup']}
                isRequired
                items={[
                  {
                    isDisabled: false,
                    label: 'User Role',
                    value: 'user_role'
                  },
                  {
                    isDisabled: false,
                    label: 'User Name',
                    value: 'user_name'
                  }
                ]}
                breakItemLabel={false}
                itemCustomStyles={{ fontSize: '16px', marginRight: '24px' }}
                labelCustomStyles={{ marginBottom: '8px', fontSize: '16px' }}
              />
            </div>
            <div>
              <Field
                name="attributeuser"
                fieldlabel={t('approvergroup.selectuser')}
                placeholder=" "
                component={Components['multiSelectDropdown']}
                isRequired
                options={[]}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <FieldArray name="attributes">
        {({ push, remove }) => (
          <>
            {values.attributes?.map((attribute, index) => (
              <div key={index}>
                <div className="attributeBox">
                  <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                    <Field
                      name={`attributes[${index}].attributeType`}
                      fieldlabel={t(`${t('approvergroup.attribute')} ${index + 1}`)}
                      placeholder=" "
                      component={Components['dropdown']}
                      isRequired
                      options={getAvailableOptions(index)}
                    />
                    <div className={`${attribute.attributeType === 'User' ? 'grid-column-4-by-1 sm:grid-column-1-by-1' : ''}`}>
                      <RenderControls attributeType={attribute.attributeType} index={index} />
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
