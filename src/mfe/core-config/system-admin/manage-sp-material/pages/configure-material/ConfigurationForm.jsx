import React from 'react';
import { CheckboxGroup, Heading, Button, RadioGroup } from '@mckesson/mcp-component-library';
import { Field } from 'formik';
import styles from './Configure.module.scss';
import Components from '@src/components/form/Components';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { useFormikContext, getIn } from 'formik';
import { FIELD_NAMES, getFieldFormatOptions, fieldFormatRegexObj } from './config';
import CustomRegex from './CustomRegex';
import { MANUFACTURER } from '@src/mfe/order-management/pages/create/form-segments/Constants';

const ConfigurationForm = ({ field, index, setFieldError, setFieldTouched }) => {
  const { t } = useTranslate();
  const [customRegex, setCustomRegex] = React.useState(false);
  const { values, setFieldValue, errors } = useFormikContext();

  const path = (name) => `fields[${index}].properties.${name}`;

  const fieldEntry = values.fields[index]?.properties || {};

  const displayOnForm = !!fieldEntry?.displayOnForm;
  const showHelpIcon = !!fieldEntry.showHelpIcon;
  const formatType = fieldEntry.fieldFormat.formatType;

  const checkboxOptions = [
    {
      isDisabled:
        (values.manufacturerName === MANUFACTURER.ORCA && [FIELD_NAMES.PATIENT_IDENTIFIER, FIELD_NAMES.MEDICAL_RECORD_NUMBER].includes(field.fieldName)) ||
        (values.manufacturerName === MANUFACTURER.REGENERON && [FIELD_NAMES.COI_ID, FIELD_NAMES.PATIENT_IDENTIFIER].includes(field.fieldName)) ||
        (values.manufacturerName === MANUFACTURER.KITE && [FIELD_NAMES.PATIENT_IDENTIFIER].includes(field.fieldName)),
      isChecked: displayOnForm,
      label: t('manageSPMaterial.configuration.checkbox.displayOnForm'),
      value: 'displayOnForm'
    },
    {
      isDisabled: !displayOnForm,
      isChecked: !!fieldEntry.mandatoryField,
      label: t('manageSPMaterial.configuration.checkbox.mandatoryField'),
      value: 'mandatoryField'
    },
    {
      isDisabled: !displayOnForm,
      isChecked: showHelpIcon,
      label: t('manageSPMaterial.configuration.checkbox.showHelpIcon'),
      value: 'showHelpIcon'
    }
  ];

  const handleCheckboxToggle = (value) => {
    const current = !!getIn(values, path(value));
    setFieldValue(path(value), !current);
    if (value === 'displayOnForm') {
      setFieldError(`fields[${index}]`, '');
      setFieldValue(path('showHelpIcon'), false);
      setFieldValue(path('mandatoryField'), false);
    } else if (value === 'showHelpIcon') {
      setFieldValue(path('helpInfoMessage'), '');
      setFieldError(path('helpInfoMessage'), undefined);
      setFieldTouched(path('helpInfoMessage'), false);
    }
  };

  return (
    <div className="MCP-module-body">
      <div className={styles.checkboxGroupConfig}>
        <Field name={path('displayOnForm')}>
          {() => (
            <CheckboxGroup
              caption=""
              direction="row"
              id={`checkbox-group-${index}`}
              itemCustomStyles={{ marginRight: '40px' }}
              items={checkboxOptions.map((item) => ({
                ...item,
                isChecked: !!getIn(values, path(item.value)),
                onChange: () => handleCheckboxToggle(item.value)
              }))}
              labelCustomStyles={{ fontSize: '16px' }}
            />
          )}
        </Field>
      </div>

      <Field
        name={path('displayName')}
        label={t('manageSPMaterial.configuration.label.displayName')}
        isRequired={displayOnForm}
        component={Components['input']}
        isReadOnly={!displayOnForm}
      />

      <Field
        name={path('helpInfoMessage')}
        label={t('manageSPMaterial.configuration.label.helpInfoMessage')}
        isRequired={displayOnForm && showHelpIcon}
        component={Components['input']}
        isReadOnly={!displayOnForm || !showHelpIcon}
      />

      <ModuleHeader heading={<Heading as="h2">{t('manageSPMaterial.configuration.label.fieldFormat')}</Heading>} />

      <div className={`grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 ${styles.fieldFormateWrapper}`}>
        <div className={styles.dropdown}>
          <Field
            id="fieldFormat.formatType"
            name={path('fieldFormat.formatType')}
            fieldlabel={t('manageSPMaterial.configuration.label.formatType')}
            component={Components['dropdown']}
            isRequired={displayOnForm}
            options={getFieldFormatOptions(field.fieldName)}
            isReadOnly={!displayOnForm}
            onChangeHandler={(value) => {
              setFieldValue(path('fieldFormat.formatType'), value);
              setFieldValue(path('fieldFormat.validationRegex'), fieldFormatRegexObj[value].regex);
              setFieldValue(path('errorMessage'), fieldFormatRegexObj[value].errorMessage);
            }}
          />
        </div>

        <Field
          name={path('fieldFormat.validationRegex')}
          label={t('manageSPMaterial.configuration.label.validationRegex')}
          component={Components['input']}
          isReadOnly={true}
          infoText={t('manageSPMaterial.configuration.label.tooltip.helpText')}
        />

        <div className="controls">
          <Button
            size="md"
            variant="secondary"
            onClick={() => {
              setFieldValue(path('fieldFormat.validationRegex'), fieldFormatRegexObj[fieldEntry?.fieldFormat?.formatType].regex);
              setFieldValue(path('fieldFormat.validationFormat'), '');
            }}
            disabled={!displayOnForm || !formatType || formatType === 'Time_HH_MM'}>
            {t('manageSPMaterial.configuration.button.reset')}
          </Button>

          <Button size="md" buttonWidth="100%" variant="secondary" onClick={() => setCustomRegex(true)} disabled={!displayOnForm || !formatType || formatType === 'Time_HH_MM'}>
            {t('manageSPMaterial.configuration.button.editRegex')}
          </Button>
        </div>
      </div>
      <Field
        name={path('errorMessage')}
        label={t('manageSPMaterial.configuration.label.errorMessage')}
        isRequired={displayOnForm}
        component={Components['input']}
        isReadOnly={!displayOnForm}
      />

      {customRegex && (
        <CustomRegex
          path={path}
          onClose={() => setCustomRegex(false)}
          initialValue={fieldEntry?.fieldFormat?.validationRegex}
          validationFormat={fieldEntry?.fieldFormat?.validationFormat}
          type={fieldEntry?.fieldFormat?.formatType}
        />
      )}
    </div>
  );
};

export default ConfigurationForm;
