import React from 'react';
import { Switch, Tooltip, Heading } from '@mckesson/mcp-component-library';
import style from './Style.module.scss';

const SettingPanelRenderer = ({ config }) => {
  const { moduleName, options, sections } = config;
  return (
    <div className={style['notification-setting']}>
      <div className={style.grid}>
        <div className={style['module-header']}>{moduleName}</div>
        <div className={style.options}>
          {options.map((key) => (
            <div className={`${style.option} ${style.header}`} key={`option-column-${key}`}>
              {key}
            </div>
          ))}
        </div>
      </div>
      <div className={style.sections}>
        {sections.map((section, sectionIndex) => {
          const { title, subtitle, rows = [] } = section;
          return (
            <div className={style.section}>
              <div className={`${style.grid} ${style.header}`}>
                <div className={style.info}>
                  <div>{title}</div>
                  <p>{subtitle}</p>
                </div>
                <div className={style.options}>
                  {section.optionValues &&
                    options.map((optionKey, index) => {
                      return (
                        <div className={style.option}>
                          <Switch id={`notification-setting-${sectionIndex}-header-${optionKey}`} size="lg" checked={false} onChange={() => {}} />
                        </div>
                      );
                    })}
                </div>
              </div>
              {rows.length > 0 ? (
                <div className={style.rows}>
                  {rows.map((row, rowIndex) => {
                    const { title, subtitle, optionValues } = row;
                    return (
                      <div className={style.grid}>
                        <div className={style.info}>
                          <div>{title}</div>
                          <p>{subtitle}</p>
                        </div>
                        {}
                        <div className={style.options}>
                          {options.map((optionKey, index) => {
                            const { value, tooltip } = optionValues[index] || {};
                            return (
                              <div className={style.option}>
                                <Tooltip body={tooltip}>
                                  <Switch id={`notification-setting-${sectionIndex}-${rowIndex}-${optionKey}`} size="lg" checked={value} onChange={() => {}} />
                                </Tooltip>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SettingPanelRenderer;
