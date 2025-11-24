import React from 'react';
import { CheckboxGroup, Heading, Button, RadioGroup } from '@mckesson/mcp-component-library';
import { Field } from 'formik';
import './Configure.scss';
import Components from '@src/components/form/Components';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { useFormikContext, getIn } from 'formik';
import { fieldFormatOptions, fieldFormatRegexObj } from './config';
import CustomRegex from './CustomRegex';

const ConfigurationForm = ({ index }) => {
  const { t } = useTranslate();
  const [customRegex, setCustomRegex] = React.useState(false);
  const { values, setFieldValue, setErrors, setTouched, errors } = useFormikContext();

  const path = (name) => `fields[${index}].${name}`;
  const fieldEntry = values.fields[index] || {};

  const displayOnForm = !!fieldEntry.displayOnForm;
  const showHelpIcon = !!fieldEntry.showHelpIcon;
  const formatType = fieldEntry.fieldFormat.formatType;

  const checkboxOptions = [
    {
      isDisabled: false,
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
  };

  return (
    <div className="MCP-module-body">
      <div className="checkbox-group-config">
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
        maxLength={50}
        isReadOnly={!displayOnForm}
      />

      <Field
        name={path('errorMessage')}
        label={t('manageSPMaterial.configuration.label.errorMessage')}
        isRequired={displayOnForm}
        component={Components['input']}
        maxLength={50}
        isReadOnly={!displayOnForm}
      />

      <Field
        name={path('helpInfoMessage')}
        label={t('manageSPMaterial.configuration.label.helpInfoMessage')}
        isRequired={displayOnForm && showHelpIcon}
        component={Components['input']}
        maxLength={50}
        isReadOnly={!displayOnForm || !showHelpIcon}
      />

      <ModuleHeader heading={<Heading as="h2">{t('manageSPMaterial.configuration.label.fieldFormat')}</Heading>} />

      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 field-formate-wrapper">
        <Field
          id="fieldFormat.formatType"
          name={path('fieldFormat.formatType')}
          fieldlabel={t('manageSPMaterial.configuration.label.formatType')}
          component={Components['dropdown']}
          isRequired={displayOnForm}
          options={fieldFormatOptions}
          isReadOnly={!displayOnForm}
          onChangeHandler={(value) => {
            setFieldValue(path('fieldFormat.formatType'), value);
            setFieldValue(path('fieldFormat.validationRegex'), fieldFormatRegexObj[value]);
          }}
        />

        <Field
          name={path('fieldFormat.validationRegex')}
          label={t('manageSPMaterial.configuration.label.validationRegex')}
          isRequired={displayOnForm}
          component={Components['input']}
          maxLength={200}
          isReadOnly={true}
          tooltipText={t('manageSPMaterial.configuration.label.tooltip.selectFieldFormat')}
        />

        <div className="controls">
          <Button
            size="md"
            variant="secondary"
            onClick={() => setFieldValue(path('fieldFormat.validationRegex'), fieldFormatRegexObj[fieldEntry?.fieldFormat?.formatType])}
            disabled={!formatType}>
            {t('manageSPMaterial.configuration.button.reset')}
          </Button>

          <Button size="md" buttonWidth="100%" variant="secondary" onClick={() => setCustomRegex(true)} disabled={!formatType}>
            {t('manageSPMaterial.configuration.button.editRegex')}
          </Button>
        </div>
      </div>

      {customRegex && (
        <CustomRegex
          path={path}
          onClose={() => setCustomRegex(false)}
          initialValue={fieldEntry?.fieldFormat?.validationRegex}
          type={fieldEntry?.fieldFormat?.formatType}
        />
      )}
    </div>
  );
};

export default ConfigurationForm;
