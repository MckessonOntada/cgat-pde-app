import React, { useMemo } from 'react';
import { Field } from 'formik';
import Components from '@src/components/form/Components';
import { Required } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import FileInput from '@src/components/FileInput';
import US_STATE_CITY from '@src/assets/data/US_States_and_Cities.json';

const OrgDetailsFormSegment = () => {
  const { t } = useTranslate();

  const options = useMemo(() => {
    const _options = [
      {
        isDisabled: true,
        value: '',
        label: t('orgManagement.create_org.option.please_select')
      }
    ];

    for (let s in US_STATE_CITY) {
      let state = US_STATE_CITY[s];

      for (let city of state) {
        _options.push({
          isDisabled: false,
          value: city,
          label: city
        });
      }
    }

    return _options.splice(0, 10);
  }, []);

  return (
    <div className="form-container">
      <div className="headingBox">
        <p className="form-segment-title">{t('orgManagement.create_org.org-details')}</p>

        <p className="form-instruction">
          <Required id="Required" /> {t('orgManagement.create_org.required')}
        </p>
      </div>

      <Field name="name" label={t('orgManagement.create_org.inputLabel.org_name')} placeholder=" " isRequired component={Components['input']} />

      {/* Use setFieldValue with FileUpload component */}

      <Field name="file">
        {({ field, form }) => (
          <FileInput
            initialLogo={field.value}
            onFileSelect={(file) => {
              form.setFieldValue(field.name, file);
            }}
            label="Upload file"
          />
        )}
      </Field>

      {/* Remaining Fields */}
      <div className="headingBox">
        <p className="form-segment-title">{t('orgManagement.create_org.contact_details')}</p>
      </div>

      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start">
        <Field name="contactPerson.firstName" label={t('orgManagement.create_org.inputLabel.first_name')} placeholder=" " isRequired component={Components['input']} />
        <Field name="contactPerson.middleName" label={t('orgManagement.create_org.inputLabel.middle_name')} placeholder=" " component={Components['input']} />
        <Field name="contactPerson.lastName" label={t('orgManagement.create_org.inputLabel.last_name')} placeholder=" " isRequired component={Components['input']} />
        <Field name="contact.email" label={t('orgManagement.create_org.inputLabel.email')} placeholder=" " isRequired component={Components['input']} />
        <Field name="contact.phone" label={t('orgManagement.create_org.inputLabel.phone_no')} component={Components['phoneInput']} className="phoneInput" placeholder=" " isRequired />
        <Field name="contact.fax" label={t('orgManagement.create_org.inputLabel.fax')} placeholder=" " component={Components['input']} />
      </div>

      <div className="headingBox">
        <p className="form-segment-title">{t('orgManagement.create_org.address_details')}</p>
      </div>

      <div>
        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2  align-items-start line-height">
          <Field name="address.address1" label={t('orgManagement.create_org.inputLabel.address_1')} placeholder=" " isRequired component={Components['input']} />
          <Field name="address.address2" label={t('orgManagement.create_org.inputLabel.address_2')} placeholder=" " component={Components['input']} />
        </div>

        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3  align-items-start line-height">
          <Field name="address.city" label={t('orgManagement.create_org.inputLabel.city')} placeholder=" " isRequired component={Components['input']} />
          <Field name="address.zip" label={t('orgManagement.create_org.inputLabel.zip')} placeholder=" " isRequired component={Components['input']} />
          <Field name="address.state" fieldlabel={t('orgManagement.create_org.inputLabel.state')} placeholder=" " component={Components['dropdown']} isRequired options={options} />
        </div>
      </div>
    </div>
  );
};

export default OrgDetailsFormSegment;
