import React from 'react';
import { Field } from 'formik';
import Components from '@src/components/form/Components';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';

const FormRenderer = ({ fieldPrefix = '', sections = [] }) => {
  const { t } = useTranslate();
  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <div className="MCP-form">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="form-section">
              {(section.title ||
                section.primaryAction ||
                section.isRequired) && (
                <div className={'row-space-between-center'}>
                  <div className="form-section-heading">
                    {section.title && (
                      <Heading as="h1">{t(section.title)}</Heading>
                    )}
                  </div>
                  <div className="controls">
                    {section.primaryAction}
                    {section.isRequired && (
                      <p className="form-instruction">
                        <span className="required">*</span>{' '}
                        {t('labels.required')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {(section.subTitle || section.secondaryActions) && (
                <div className={'row-space-between-center'}>
                  <div classname="form-section-heading">
                    {section.subTitle && (
                      <Heading as="h3">{t(section.subTitle)}</Heading>
                    )}
                  </div>
                  <div className="controls">{section.secondaryActions}</div>
                </div>
              )}

              {section.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="form-control-row">
                  <div key={rowIndex} className={`${row.grid}`}>
                    {row.controls.map((control, controlIndex) => {
                      const Component = Components[control.type]; // dynamic component
                      if (!Component) return null;

                      return (
                        <Field
                          id={`${fieldPrefix}${control.name}`}
                          key={`${fieldPrefix}_${control.name}_${controlIndex}`}
                          name={`${fieldPrefix}${control.name}`}
                          label={t(control.label)}
                          placeholder={control.placeholder || ' '}
                          isRequired={control.isRequired}
                          component={Component}
                          options={control.options}
                          maxLength={control.maxLength}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormRenderer;
