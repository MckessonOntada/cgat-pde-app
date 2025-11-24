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
  const [errors, setErrors] = useState({ minLength: '', maxLength: '' });
  const config = regexAttributes[type]?.attributes || { text: [], checkbox: [] };

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
    maxDate: ''
  });

  useEffect(() => {
    if (initialValue) {
      const parsed = parseRegex(initialValue);
      if (parsed) setRegexState((prev) => ({ ...prev, ...parsed }));
    }
  }, []);

  function parseRegex(regex) {
    if (!regex) return null;

    // DATE CASE
    if (type === 'Date_MM_DD_YYYY') {
      const yr = regex.match(/\/(\d{4})(?:-(\d{4}))?\$/);
      if (yr) {
        return {
          minDate: new Date(yr[1], 0, 1),
          maxDate: new Date(yr[2] || yr[1], 11, 31)
        };
      }
      return { minDate: '', maxDate: '' };
    }

    const matches = regex.match(/^\^(.*)?\[(.+?)\]\{(\d+),(\d+)\}(.*)?\$/);
    if (!matches) return null;

    const [, prefix = '', charSet, min, max, suffix = ''] = matches;

    const flags = {
      allowUpper: false,
      allowLower: false,
      allowNumbers: false,
      allowSpace: false,
      allowHyphen: false,
      allowUnderscore: false,
      allowDot: false
    };

    let customChars = '';

    for (let i = 0; i < charSet.length; i++) {
      const c = charSet[i];

      if (i < charSet.length - 2 && charSet[i + 1] === '-' && charSet[i + 2]) {
        const range = `${c}-${charSet[i + 2]}`;
        if (range === 'A-Z') flags.allowUpper = true;
        else if (range === 'a-z') flags.allowLower = true;
        else if (range === '0-9') flags.allowNumbers = true;

        i += 2;
        continue;
      }

      if (c === '\\') {
        const next = charSet[i + 1];
        if (next === 's') flags.allowSpace = true;
        else if (next === '-') flags.allowHyphen = true;
        else if (next === '.') flags.allowDot = true;
        else customChars += '\\' + next;
        i++;
        continue;
      }

      if (c === '_') flags.allowUnderscore = true;
      else customChars += c;
    }

    return {
      prefix,
      suffix,
      minLength: Number(min),
      maxLength: Number(max),
      ...flags,
      customChars
    };
  }

  function buildDateRegex(minDate, maxDate) {
    if (!minDate || !maxDate) return '^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\\d{4}$';

    const min = new Date(minDate);
    const max = new Date(maxDate);

    if (isNaN(min) || isNaN(max)) {
      return '^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\\d{4}$';
    }

    const y1 = min.getFullYear();
    const y2 = max.getFullYear();

    const yearPattern = y1 === y2 ? `${y1}` : `${y1}-${y2}`;

    return `^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/(${yearPattern})$`;
  }

  function escapeCharForSet(c) {
    if (c === '\\' || c === '^' || c === '-' || c === ']') {
      return '\\' + c;
    }
    return c;
  }

  function buildRegex() {
    if (type === 'Date_MM_DD_YYYY') {
      return buildDateRegex(regexState.minDate, regexState.maxDate);
    }

    let allowed = '';

    if (regexState.allowUpper) allowed += 'A-Z';
    if (regexState.allowLower) allowed += 'a-z';
    if (regexState.allowNumbers) allowed += '0-9';
    if (regexState.allowSpace) allowed += '\\s';
    if (regexState.allowHyphen) allowed += '\\-';
    if (regexState.allowUnderscore) allowed += '_';
    if (regexState.allowDot) allowed += '\\.';

    const custom = (regexState.customChars || '')
      .split('')
      .map((c) => escapeCharForSet(c))
      .join('');

    allowed += custom;

    return `^${regexState.prefix}[${allowed}]{${regexState.minLength},${regexState.maxLength}}${regexState.suffix}$`;
  }

  const handleApply = () => {
    const finalRegex = buildRegex();
    setFieldValue(path('fieldFormat.validationRegex'), finalRegex);
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

              if (item.key === 'minLength' || item.key === 'maxLength') {
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
