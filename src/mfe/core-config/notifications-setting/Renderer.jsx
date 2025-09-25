import React from 'react';
import { Switch, Tooltip } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useFormikContext } from 'formik';
import style from './Style.module.scss';

const SettingPanelRenderer = ({ config }) => {
  const { t: translateFn } = useTranslate();
  const { moduleName, options, sections } = config;
  const { values, setFieldValue } = useFormikContext();

  const handleOnChange = (e, keyPath) => {
    setFieldValue(`preferences.${keyPath}`, e.target.checked);
  };

  const handleHeaderChange = (sectionIndex, index) => (e) => handleOnChange(e, `sections[${sectionIndex}].optionValues[${index}]`);

  const handleRowChange = (sectionIndex, rowIndex, index) => (e) => handleOnChange(e, `sections[${sectionIndex}].rows[${rowIndex}].optionValues[${index}]`);

  return (
    <div className={style['notification-setting']}>
      <div className={style.grid}>
        <div className={style['module-header']}>{translateFn(moduleName)}</div>
        <div className={style.options}>
          {options.map((key) => (
            <div className={`${style.option} ${style.header}`} key={`option-column-${key}`}>
              {translateFn(key)}
            </div>
          ))}
        </div>
      </div>

      <div className={style.sections}>
        {sections.map((section, sectionIndex) => {
          const { title, subtitle, rows = [], optionValues, isPreferred } = section;
          return (
            <div className={style.section} key={`section-${sectionIndex}`}>
              <div className={`${style.grid} ${style.header}`}>
                <div className={style.info}>
                  <div className={style.heading}>{translateFn(title)}</div>
                  <p className={style.details}>{translateFn(subtitle)}</p>
                </div>

                <div className={style.options}>
                  {optionValues &&
                    options.map((optionKey, index) => {
                      const { tooltip } = optionValues[index] || {};
                      return (
                        <div className={style.option} key={`section-${sectionIndex}-header-option-${index}`}>
                          <Tooltip body={translateFn(isPreferred ? 'notificationPreferences.optionNotAllowed' : tooltip)}>
                            <div className={style['switch-control']}>
                              <Switch
                                id={`notification-setting-${sectionIndex}-header-${optionKey}`}
                                size="lg"
                                disabled={isPreferred}
                                checked={values.preferences?.sections?.[sectionIndex]?.optionValues?.[index] ?? false}
                                onChange={handleHeaderChange(sectionIndex, index)}
                              />
                            </div>
                          </Tooltip>
                        </div>
                      );
                    })}
                </div>
              </div>

              {rows.length > 0 && (
                <div className={style.rows}>
                  {rows.map((row, rowIndex) => {
                    const { title, subtitle, optionValues: rowOptionValues, isPreferred: rowPreferred } = row;
                    return (
                      <div className={style.grid} key={`section-${sectionIndex}-row-${rowIndex}`}>
                        <div className={style.info}>
                          <div className={style.heading}>{translateFn(title)}</div>
                          <p className={style.details}>{translateFn(subtitle)}</p>
                        </div>
                        <div className={style.options}>
                          {options.map((optionKey, index) => {
                            const { tooltip } = rowOptionValues[index] || {};
                            return (
                              <div className={style.option} key={`section-${sectionIndex}-row-${rowIndex}-option-${index}`}>
                                <Tooltip body={translateFn(rowPreferred ? 'notificationPreferences.optionNotAllowed' : tooltip)}>
                                  <div className={style['switch-control']}>
                                    <Switch
                                      id={`notification-setting-${sectionIndex}-${rowIndex}-${optionKey}`}
                                      size="lg"
                                      disabled={rowPreferred}
                                      checked={values.preferences?.sections?.[sectionIndex]?.rows?.[rowIndex]?.optionValues?.[index] ?? false}
                                      onChange={handleRowChange(sectionIndex, rowIndex, index)}
                                    />
                                  </div>
                                </Tooltip>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SettingPanelRenderer;
