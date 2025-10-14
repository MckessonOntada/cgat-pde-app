import React from 'react';
import { Switch, Tooltip } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useFormikContext } from 'formik';
import style from './Style.module.scss';
import PermittedComponent from '@src/components/permitted-component';
import usePermission from '@src/hooks/usePermissions';

const SettingPanelRenderer = ({ config, isLoadingPreferences, isPreferencesLoaded }) => {
  const { t: translateFn } = useTranslate();
  const { moduleName, options, sections } = config;
  const { values, setFieldValue } = useFormikContext();
  const { hasPermission, hasAnyPermission } = usePermission();
  const handleOnChange = (e, keyPath) => setFieldValue(keyPath, e.target.checked);
  const handleHeaderChange = (sectionIndex, index) => (e) => handleOnChange(e, `sections[${sectionIndex}].optionValues[${index}].value`);
  const handleRowChange = (sectionIndex, rowIndex, index) => (e) =>
    handleOnChange(e, `sections[${sectionIndex}].rows[${rowIndex}].optionValues[${index}].value`);

  const preferenceSections = sections.map((section, sectionIndex) => {
    const { title, subtitle, rows = [], optionValues, permissions } = section;
    let _hasPermission;
    if (permissions && Array.isArray(permissions)) {
      _hasPermission = hasAnyPermission(permissions);
    } else {
      _hasPermission = hasPermission(permissions);
    }
    if (!_hasPermission || !permissions) return null;

    return (
      <PermittedComponent permissions={permissions}>
        <div className={style.section} key={`section-${sectionIndex}`}>
          <div className={`${style.grid} ${style.header}`}>
            <div className={style.info}>
              <div className={style.heading}>{translateFn(title)}</div>
              <p className={style.details}>{translateFn(subtitle)}</p>
            </div>
            <div className={style.options}>
              {optionValues &&
                options.map((optionKey, index) => {
                  const { isPreferred } = optionValues[index] || {};
                  const isDisabled = !isPreferencesLoaded || isPreferred || isLoadingPreferences;
                  const controlValue = values.sections?.[sectionIndex]?.optionValues?.[index].value ?? false;
                  const tooltipKey = isPreferred
                    ? 'notificationPreferences.optionNotAllowed'
                    : controlValue
                    ? 'notificationPreferences.unsubscribePreference'
                    : 'notificationPreferences.subscribePreference';
                  return (
                    <div className={style.option} key={`section-${sectionIndex}-header-option-${index}`}>
                      <Tooltip body={translateFn(tooltipKey)}>
                        <div className={style['switch-control']}>
                          <Switch
                            id={`notification-setting-${sectionIndex}-header-${optionKey}`}
                            size="lg"
                            disabled={isDisabled}
                            checked={controlValue}
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
                const { title, subtitle, optionValues: rowOptionValues } = row;
                return (
                  <div className={style.grid} key={`section-${sectionIndex}-row-${rowIndex}`}>
                    <div className={style.info}>
                      <div className={style.heading}>{translateFn(title)}</div>
                      <p className={style.details}>{translateFn(subtitle)}</p>
                    </div>
                    <div className={style.options}>
                      {options.map((optionKey, index) => {
                        const { isPreferred = false } = rowOptionValues[index] || {};
                        const controlValue = values.sections?.[sectionIndex]?.rows?.[rowIndex]?.optionValues?.[index]?.value ?? false;
                        const isDisabled = !isPreferencesLoaded || isPreferred || isLoadingPreferences;
                        const tooltipKey = isPreferred
                          ? 'notificationPreferences.optionNotAllowed'
                          : controlValue
                          ? 'notificationPreferences.unsubscribePreference'
                          : 'notificationPreferences.subscribePreference';
                        return (
                          <div className={style.option} key={`section-${sectionIndex}-row-${rowIndex}-option-${index}`}>
                            <Tooltip body={translateFn(tooltipKey)}>
                              <div className={style['switch-control']}>
                                <Switch
                                  id={`notification-setting-${sectionIndex}-${rowIndex}-${optionKey}`}
                                  size="lg"
                                  disabled={isDisabled}
                                  checked={controlValue}
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
      </PermittedComponent>
    );
  });

  if (preferenceSections.filter((key) => Boolean(key)).length <= 0) return null;

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

      <div className={style.sections}>{preferenceSections}</div>
    </div>
  );
};

export default SettingPanelRenderer;
