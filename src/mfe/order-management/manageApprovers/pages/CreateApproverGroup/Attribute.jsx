import React from 'react';
import { Field, FieldArray } from 'formik';
import { useTranslate } from '@src/translations/useTranslation';
import Components from '@src/components/form/Components';
import { RadioGroup, Button, Divider } from '@mckesson/mcp-component-library';
import { ReactComponent as DeleteIcon } from '@src/assets/svg/bin-red.svg';
import './index.scss';

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
    return attrOptions.filter((option) => option.value === '' || !selectedValues.includes(option.value) || values.attributes[index]?.attributeType === option.value);
  };
  const renderControl = (attributeType, index) => {
    switch (attributeType) {
      case 'Price':
        return (
          <div>
            <Field id="price" name="price" label={t('approvergroup.value.price')} placeholder=" " isRequired component={Components['input']} maxLength={50} />
          </div>
        );
      case 'Catalog':
      case 'Account':
        return (
          <div>
            <Field name="attribute1" fieldlabel={t('approvergroup.selectuser')} placeholder=" " component={Components['multiSelectDropdown']} isRequired options={[]} />
          </div>
        );

      case 'User':
        return (
          <div>
            <label htmlFor={`attributes[${index}].value`} style={{ display: 'block', marginBottom: '0.5rem' }}>
              {t('approvergroup.value.user')} *
            </label>
            <div>
              <RadioGroup
                caption="Please select one option"
                direction="row"
                id="radioGroup"
                items={[
                  {
                    isDisabled: false,
                    label: 'User Role',
                    value: 'User Role'
                  },
                  {
                    isDisabled: false,
                    label: 'User Name',
                    value: 'User Name'
                  }
                ]}
                onChangeValue={() => {}}
                onOtherTextChange={() => {}}
                onSubRadioFieldChange={() => {}}
                radioBtnWidth="auto"
                value="User Role"
              />
            </div>
            <div>
              <Field name="attributeuser" fieldlabel={t('approvergroup.selectuser')} placeholder=" " component={Components['multiSelectDropdown']} isRequired options={[]} />
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
                    <Field name={`attributes[${index}].attributeType`} fieldlabel={t(`${t('approvergroup.attribute')} ${index + 1}`)} placeholder=" " component={Components['dropdown']} isRequired options={getAvailableOptions(index)} />
                    <div>{renderControl(attribute.attributeType, index)}</div>
                    <div className="remove"> {index !== 0 && <Button Icon={DeleteIcon} variant="tertiary" size="md" label="REMOVE" className="btnRemove" onClick={() => remove(index)}></Button>}</div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ paddingTop: '10px' }}>
              <Divider />
            </div>
            <div style={{ paddingTop: '20px' }}>
              <Button variant="tertiary" size="md" label="+ ADD ATTRIBUTE" onClick={() => push({ attributeType: '', value: '' })} disabled={isAddDisabled}></Button>
            </div>
          </>
        )}
      </FieldArray>
    </div>
  );
};

export default Attributes;
