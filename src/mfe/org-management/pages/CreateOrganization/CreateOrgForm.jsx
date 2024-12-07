import React from 'react';
import { Field } from 'formik';
import Components from '@src/components/form/Components';
import { Required, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import FileInput from '@src/components/FileInput';
import { US_STATES } from '@src/components/form/util';

const OrgDetailsFormSegment = () => {
  const { t } = useTranslate();

  const usStates = US_STATES();
  usStates.unshift({
    isDisabled: true,
    value: '',
    label: t('orgManagement.create_org.option.please_select')
  });

  return (
    <div className="form-container">
      <div className="headingBox">
        <Heading as="h3">{t('orgManagement.create_org.org-details')}</Heading>

        <p className="form-instruction">
          <Required id="Required" /> {t('orgManagement.create_org.required')}
        </p>
      </div>

      <Field name="name" label={t('orgManagement.create_org.inputLabel.org_name')} placeholder=" " isRequired component={Components['input']} maxLength={100} />

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
        <Heading as="h3">{t('orgManagement.create_org.contact_details')}</Heading>
      </div>

      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-start">
        <Field name="contactPerson.firstName" label={t('orgManagement.create_org.inputLabel.first_name')} placeholder=" " isRequired component={Components['input']} maxLength={50} />
        <Field name="contactPerson.middleName" label={t('orgManagement.create_org.inputLabel.middle_name')} placeholder=" " component={Components['input']} maxLength={50} />
        <Field name="contactPerson.lastName" label={t('orgManagement.create_org.inputLabel.last_name')} placeholder=" " isRequired component={Components['input']} maxLength={50} />
        <Field name="contact.email" label={t('orgManagement.create_org.inputLabel.email')} placeholder=" " isRequired component={Components['input']} maxLength={40} />
        <Field name="contact.phone" label={t('orgManagement.create_org.inputLabel.phone_no')} component={Components['phoneInput']} className="phoneInput" placeholder=" " isRequired />
        <Field name="contact.fax" label={t('orgManagement.create_org.inputLabel.fax')} placeholder=" " component={Components['input']} maxLength={15} />
      </div>

      <div className="headingBox">
        <Heading as="h3">{t('orgManagement.create_org.address_details')}</Heading>
      </div>

      <div>
        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2  align-items-start line-height">
          <Field name="address.address1" label={t('orgManagement.create_org.inputLabel.address_1')} placeholder=" " isRequired component={Components['input']} maxLength={100} />
          <Field name="address.address2" label={t('orgManagement.create_org.inputLabel.address_2')} placeholder=" " component={Components['input']} maxLength={100} />
        </div>

        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3  align-items-start line-height">
          <Field name="address.city" label={t('orgManagement.create_org.inputLabel.city')} placeholder=" " isRequired component={Components['input']} maxLength={50} />
          <Field name="address.zip" label={t('orgManagement.create_org.inputLabel.zip')} placeholder=" " isRequired component={Components['zipInput']} maxLength={10} />
          <div className="corrected-dropdown"><Field name="address.state" fieldlabel={t('orgManagement.create_org.inputLabel.state')} placeholder=" " component={Components['dropdown']} isRequired options={usStates} /></div>
        </div>
      </div>
    </div>
  );
};

export default OrgDetailsFormSegment;
