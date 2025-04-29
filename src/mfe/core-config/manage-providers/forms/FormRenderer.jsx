import React from 'react';
import { Field } from 'formik';
import Components from '@src/components/form/Components';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';

const FormRenderer = ({ sections }) => {
  const { t } = useTranslate();
  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <div className="MCP-form">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="form-section">
              <div className="form-section-heading">
                {section.title && <Heading as="h2">{t(section.title)}</Heading>}
                {section.isRequired && (
                  <p className="form-instruction">
                    <span className="required">*</span> {t('labels.required')}
                  </p>
                )}
              </div>
              <div classname="form-section-heading">
                {section.subTitle && (
                  <Heading as="h5">{t(section.subTitle)}</Heading>
                )}
              </div>

              {section.rows.map((row, rowIndex) => (
                <div className="form-control-row">
                  <div key={rowIndex} className={`${row.grid}`}>
                    {row.controls.map((control, controlIndex) => {
                      const Component = Components[control.type]; // dynamic component
                      if (!Component) return null;

                      return (
                        <Field
                          key={controlIndex}
                          name={control.name}
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
