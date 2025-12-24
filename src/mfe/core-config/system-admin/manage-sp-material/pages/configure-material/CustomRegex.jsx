import FloatingDrawer from '@src/components/floating-drawer';
import React, { useEffect, useState } from 'react';
import { Button, CheckboxGroup, Heading, Alert, CustomDatepicker } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { useFormikContext } from 'formik';
import InputField from '@src/components/form/InputField';
import { fieldFormatRegexObj, regexAttributes } from './config';
import styles from './Configure.module.scss';

function CustomRegex({ onClose, path, initialValue, type, validationFormat }) {
  const { t } = useTranslate();
  const { setFieldValue } = useFormikContext();
  const [errors, setErrors] = useState({});
  const config = regexAttributes[type]?.attributes || { text: [], checkbox: [], date: [] };

  const [alert, setAlert] = useState(null);

  const [regexState, setRegexState] = useState({
    prefix: '',
    suffix: '',
    minLength: '',
    maxLength: '',
    allowUpper: false,
    allowLower: false,
    allowNumbers: false,
    allowSpace: false,
    allowHyphen: false,
    allowUnderscore: false,
    allowDot: false,
    customChars: '',
    minDate: '',
    maxDate: '',
    minValue: '',
    maxValue: ''
  });

  useEffect(() => {
    if (initialValue) {
      const parsed = parseRegex(initialValue);
      if (parsed) setRegexState((prev) => ({ ...prev, ...parsed }));
    }
  }, [initialValue]);

  function buildRegex() {
    const {
      prefix,
      suffix,
      minLength,
      maxLength,
      allowUpper,
      allowLower,
      allowNumbers,
      allowSpace,
      allowHyphen,
      allowUnderscore,
      allowDot,
      customChars,
      minValue,
      maxValue,
      allowNegative,
      minDate,
      maxDate
    } = regexState;

    let pattern = '';

    switch (type) {
      case 'Text':
      case 'Alphabetic':
      case 'Alphanumeric':
      case 'Uppercase Alphanumeric':
      case 'UUID/Unique ID': {
        let charSet = '';

        if (allowUpper) charSet += 'A-Z';
        if (allowLower) charSet += 'a-z';
        if (allowNumbers) charSet += '0-9';
        if (allowSpace) charSet += '\\s';
        if (allowHyphen) charSet += '-';
        if (allowUnderscore) charSet += '_';
        if (allowDot) charSet += '.';

        if (customChars) {
          const escapedCustom = customChars.replace(/[\]\\]/g, '\\$&');
          charSet += escapedCustom;
        }

        const min = minLength || 1;
        const max = maxLength || 200;

        pattern = `^${prefix || ''}[${charSet}]{${min},${max}}${suffix || ''}$`;
        break;
      }

      case 'Integer': {
        pattern = fieldFormatRegexObj['Integer'].regex;
        break;
      }
      case 'Date_MM_DD_YYYY': {
        pattern = fieldFormatRegexObj['Date_MM_DD_YYYY'].regex;
        break;
      }

      default:
        pattern = '';
    }

    return `${pattern}`;
  }
  function buildValidationFormat(finalRegex) {
    const {
      prefix,
      suffix,
      minLength,
      maxLength,
      allowUpper,
      allowLower,
      allowNumbers,
      allowSpace,
      allowHyphen,
      allowUnderscore,
      allowDot,
      customChars,
      minValue,
      maxValue,
      allowNegative,
      minDate,
      maxDate
    } = regexState;

    let details = [];

    if (prefix) details.push(`prefix('${prefix}')`);
    if (suffix) details.push(`suffix('${suffix}')`);

    if (minLength) details.push(`minLength('${minLength}')`);
    if (maxLength) details.push(`maxLength('${maxLength}')`);

    if (minValue) details.push(`minValue('${minValue}')`);
    if (maxValue) details.push(`maxValue('${maxValue}')`);

    if (minDate) details.push(`minDate('${minDate}')`);
    if (maxDate) details.push(`maxDate('${maxDate}')`);

    if (allowUpper) details.push(`allowedUpper`);
    if (allowLower) details.push(`allowedLower`);
    if (allowNumbers) details.push(`allowedNumbers`);
    if (allowSpace) details.push(`allowedSpace`);
    if (allowHyphen) details.push(`allowedHyphen`);
    if (allowUnderscore) details.push(`allowedUnderscore`);
    if (allowDot) details.push(`allowedDot`);
    if (allowNegative) details.push(`allowNegative`);

    if (customChars) details.push(`customChars('${customChars}')`);

    const joined = details.join(',');

    return `${type}:"${finalRegex}"::${joined}`;
  }

  function parseRegex(regex) {
    if (!regex) return null;

    const newState = {};

    if (['Text', 'Alphabetic', 'Alphanumeric', 'Uppercase Alphanumeric', 'UUID/Unique ID'].includes(type)) {
      const match = regex.match(/^\^?(.*?)\[(.*?)]\{(\d+),(\d+)}(.*?)\$?$/);
      if (match) {
        const [, prefix, charSet, minLen, maxLen, suffix] = match;
        newState.prefix = prefix || '';
        newState.suffix = suffix || '';
        newState.minLength = minLen || '';
        newState.maxLength = maxLen || '';

        newState.allowUpper = /A-Z/.test(charSet);
        newState.allowLower = /a-z/.test(charSet);
        newState.allowNumbers = /0-9/.test(charSet);
        newState.allowSpace = /s/.test(charSet);
        newState.allowHyphen = /-/.test(charSet);
        newState.allowUnderscore = /_/.test(charSet);
        newState.allowDot = /\./.test(charSet);

        const custom = charSet.replace(/[A-Za-z0-9s\-_.]/g, '');
        newState.customChars = custom || '';
      }
    } else if (type === 'Integer') {
      newState.minValue = validationFormat.match(/minValue\('(\d+)'\)/)?.[1] ?? '';
      newState.maxValue = validationFormat.match(/maxValue\('(\d+)'\)/)?.[1] ?? '';
    } else if (type === 'Date_MM_DD_YYYY') {
      newState.minDate = validationFormat.match(/minDate\('([^']+)'\)/)?.[1] ?? null;
      newState.maxDate = validationFormat.match(/maxDate\('([^']+)'\)/)?.[1] ?? null;
    }

    return newState;
  }
  const handleApply = () => {
    const { minLength, maxLength, minValue, maxValue, minDate, maxDate } = regexState;
    setAlert(null);

    // ---- minLength vs maxLength ----
    if (minLength && maxLength && Number(minLength) > Number(maxLength)) {
      setAlert({
        type: 'error',
        description: t('manageSPMaterial.configuration.customRegex.error.minValueGreaterThanMaxValue')
      });
      return;
    }

    // ---- minValue vs maxValue ----
    if (minValue && maxValue && Number(minValue) > Number(maxValue)) {
      setAlert({
        type: 'error',
        description: t('manageSPMaterial.configuration.customRegex.error.minValueGreaterThanMaxValue')
      });
      return;
    }

    // ---- minDate vs maxDate ----
    if (minDate && maxDate) {
      const min = new Date(minDate).getTime();
      const max = new Date(maxDate).getTime();

      if (min > max) {
        setAlert({
          type: 'error',
          description: t('manageSPMaterial.configuration.customRegex.error.minDateGreaterThanMaxDate')
        });
        return;
      }
    }

    const finalRegex = buildRegex();
    const validationFormat = buildValidationFormat(finalRegex);
    setFieldValue(path('fieldFormat.validationRegex'), finalRegex);
    setFieldValue(path('fieldFormat.validationFormat'), validationFormat);

    onClose();
  };

  return (
    <FloatingDrawer
      open
      anchor="right"
      onClose={onClose}
      heading={t('manageSPMaterial.configuration.customRegex.heading')}
      controls={
        <div className="controls">
          <Button label={t('manageSPMaterial.configuration.customRegex.button.cancel')} onClick={onClose} variant="secondary" size="md" />
          <Button label={t('manageSPMaterial.configuration.customRegex.button.apply')} onClick={handleApply} variant="primary" size="md" />
        </div>
      }>
      <div className="MCP-module-body">
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <InputField label={t('manageSPMaterial.configuration.customRegex.generatedRegex')} value={buildRegex()} isReadOnly />

        <ModuleHeader heading={<Heading as="h3">{t('manageSPMaterial.configuration.customRegex.builder')}</Heading>} />

        {config.text?.map((item) => (
          <InputField
            key={item.key}
            label={item.label}
            value={regexState[item.key]}
            error={errors[item.key]}
            helpText={t(item.helpText)}
            onChange={(e) => {
              const val = e.target.value;

              if (item.key === 'minLength' || item.key === 'maxLength' || item.key === 'minValue' || item.key === 'maxValue') {
                if (!/^[0-9]*$/.test(val)) {
                  setErrors((prev) => ({
                    ...prev,
                    [item.key]: t('manageSPMaterial.configuration.customRegex.error.onlyNumbers')
                  }));
                  return;
                } else {
                  setErrors((prev) => ({ ...prev, [item.key]: '' }));
                }
              }

              setRegexState({ ...regexState, [item.key]: val });
            }}
          />
        ))}

        {config.date?.map((dateItem) => (
          <CustomDatepicker
            key={dateItem.key}
            id={dateItem.key}
            isShowLabel
            label={dateItem.name}
            name={dateItem.key}
            value={regexState[dateItem.key] || ''}
            onChangeFn={(selectedDate) => setRegexState((prev) => ({ ...prev, [dateItem.key]: selectedDate }))}
          />
        ))}
        <div className={styles.checkboxGroup}>
          <CheckboxGroup
            direction="row"
            showFlexWrap={true}
            items={config.checkbox?.map((c) => ({
              ...c,
              isChecked: regexState[c.value],
              onChange: () => setRegexState((prev) => ({ ...prev, [c.value]: !prev[c.value] }))
            }))}
          />
        </div>
      </div>
    </FloatingDrawer>
  );
}

export default CustomRegex;
