import FloatingDrawer from '@src/components/floating-drawer';
import React, { useEffect, useState } from 'react';
import { Button, CheckboxGroup, Heading, Alert, CustomDatepicker } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { useFormikContext } from 'formik';
import InputField from '@src/components/form/InputField';
import { regexAttributes } from './config';

function CustomRegex({ onClose, path, initialValue, type }) {
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
        if (allowSpace) charSet += 's';
        if (allowHyphen) charSet += '-';
        if (allowUnderscore) charSet += '_';
        if (allowDot) charSet += '.';

        if (customChars) {
          const escapedCustom = customChars.replace(/[\]\\]/g, '\\$&');
          charSet += escapedCustom;
        }

        const min = minLength || 1;
        const max = maxLength || 200;

        pattern = `${prefix || ''}[${charSet}]{${min},${max}}${suffix || ''}`;
        break;
      }

      case 'Integer': {
        pattern = buildIntegerRegex(minValue, maxValue, allowNegative);
        break;
      }
      case 'Date_MM_DD_YYYY': {
        pattern = '(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\\d{4}';
        break;
      }

      default:
        pattern = '';
    }

    return `^${pattern}$`;
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

  function buildIntegerRegex(minValue, maxValue, allowNegative = false) {
    let pattern = '';

    if (allowNegative) pattern += '-?';

    if (minValue != null && maxValue != null) {
      const min = parseInt(minValue, 10);
      const max = parseInt(maxValue, 10);

      if (min >= 0 && max < 100) {
        const firstPart = `${Math.floor(min / 10)}[${min % 10}-9]`; // e.g., 2[3-9] for 23
        const middlePart = Math.floor(min / 10) + 1 <= Math.floor(max / 10) - 1 ? `[${Math.floor(min / 10) + 1}-${Math.floor(max / 10) - 1}][0-9]` : '';
        const lastPart = `${Math.floor(max / 10)}[0-${max % 10}]`; // e.g., 7[0-8] for 78
        pattern += `(${firstPart}${middlePart ? '|' + middlePart : ''}|${lastPart})`;
      } else {
        pattern += '\\d+';
      }
    } else {
      pattern += '\\d+';
    }

    return pattern;
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
      newState.allowNegative = /^-?/.test(regex);

      // Remove ^, $, and optional negative sign for easier parsing
      let cleaned = regex.replace(/^\^|-?\$?$/g, '');

      // Match patterns like (2[3-9]|[3-6][0-9]|7[0-8])
      const rangeMatch = cleaned.match(/\(?(\d+)\[?\d*-\d*\]?\|?(\d*\[?\d*-\d*\]?)?\)?/);

      if (rangeMatch) {
        // For simplicity, we try to detect the first and last number from the pattern
        // Split by '|' to find min and max
        const parts = cleaned.replace(/[()]/g, '').split('|');

        // Convert parts like "2[3-9]" -> min=23, "7[0-8]" -> max=78
        const numbers = parts.map((part) => {
          const match = part.match(/(\d)(?:\[(\d)-(\d)\])?/);
          if (match) {
            const [, firstDigit, startRange, endRange] = match;
            if (startRange && endRange) {
              return [parseInt(firstDigit + startRange, 10), parseInt(firstDigit + endRange, 10)];
            } else {
              return [parseInt(firstDigit, 10), parseInt(firstDigit, 10)];
            }
          }
          return [];
        });

        if (numbers.length > 0) {
          newState.minValue = numbers[0][0];
          newState.maxValue = numbers[numbers.length - 1][1];
        }
      } else {
        newState.minValue = '';
        newState.maxValue = '';
      }
    } else if (type === 'Date_MM_DD_YYYY') {
      // leave min/max empty
    }

    return newState;
  }
  const handleApply = () => {
    const finalRegex = buildRegex();
    const validationFormat = buildValidationFormat(finalRegex);

    setFieldValue(path('properties.fieldFormat.validationRegex'), finalRegex);
    setFieldValue(path('properties.fieldFormat.validationObj'), validationFormat);

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

        <CheckboxGroup
          direction="column"
          items={config.checkbox?.map((c) => ({
            ...c,
            isChecked: regexState[c.value],
            onChange: () => setRegexState((prev) => ({ ...prev, [c.value]: !prev[c.value] }))
          }))}
        />
      </div>
    </FloatingDrawer>
  );
}

export default CustomRegex;
