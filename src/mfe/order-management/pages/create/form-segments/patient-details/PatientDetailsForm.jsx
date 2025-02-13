import React from 'react';
import { Field } from 'formik';
import Components from '@src/components/form/Components';
import { Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { formConfig } from './PatientDetailsFormUtils';

const PatientDetailsForm = () => {
  const { t } = useTranslate();

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body form-container">
        {formConfig.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.sectionTitle && (
              <div className="headingBox">
                <h2>{t(section.sectionTitle)}</h2>
                {sectionIndex === 0 && (
                  <p className="form-instruction">
                    <span className='required'>*</span> {t('orderManagement.patientDetails.required')}
                  </p>
                )}
              </div>
            )}

            <div
              className={`grid grid-gap-16 grid-cols-1 md:grid-cols-${section.grid.md} lg:grid-cols-${section.grid.lg} xl:grid-cols-${section.grid.xl} align-items-start`}>
              {section.fields.map((field, index) => (
                <Field
                  {...field}
                  key={index}
                  id={field.id}
                  name={field.name}
                  label={t(field.label)}
                  placeholder={field.placeholder}
                  component={Components[field.component]}
                  maxLength={field.maxLength}
                  options={field.options}
                  isRequired={field.isRequired || false}
                  className={field.className || ''}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDetailsForm;
