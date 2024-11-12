import React from 'react';
import { Field } from 'formik';
import Components from '../../../../components/form/Components';
import { Required } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import FileInput from '../../../../components/FileInput';

const OrgDetailsFormSegment = () => {
  const { t } = useTranslate();

  const options = [
    {
      isDisabled: true,
      value: '',
      label: t('orgManagement.create_org.option.please_select')
    },
    {
      isDisabled: false,
      value: 'maharashtra',
      label: 'Maharashtra'
    },
    {
      isDisabled: false,
      value: 'delhi',
      label: 'Delhi'
    }
  ];

  return (
    <div className="form-container">
      <div className="headingBox">
        <p className="form-segment-title">{t('orgManagement.create_org.org-details')}</p>
        <p className="form-instruction">
          <Required id="Required" /> {t('orgManagement.create_org.required')}
        </p>
      </div>

      <Field
        name="org_name"
        label={t('orgManagement.create_org.inputLabel.org_name')}
        placeholder=" "
        isRequired
        component={Components['input']}
      />

      {/* Use setFieldValue with FileUpload component */}

      <Field name="file">
        {({ field, form }) => (
          <FileInput
            onFileSelect={(file) => {
              form.setFieldValue(field.name, file)
            }}
          />
        )}
      </Field>

      {/* Remaining Fields */}
      <div className="headingBox">
        <p className="form-segment-title">{t('orgManagement.create_org.contact_details')}</p>
      </div>
      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        <Field
          name="first_name"
          label={t('orgManagement.create_org.inputLabel.first_name')}
          placeholder=" "
          isRequired
          component={Components['input']}
        />
        <Field
          name="middle_name"
          label={t('orgManagement.create_org.inputLabel.middle_name')}
          placeholder=" "
          component={Components['input']}
        />
        <Field
          name="last_name"
          label={t('orgManagement.create_org.inputLabel.last_name')}
          placeholder=" "
          isRequired
          component={Components['input']}
        />
        <Field
          name="email"
          label={t('orgManagement.create_org.inputLabel.email')}
          placeholder=" "
          isRequired
          component={Components['input']}
        />
        <Field
          name="phoneInput"
          label={t('orgManagement.create_org.inputLabel.phone_no')}
          component={Components['phoneInput']}
          className="phoneInput"
          placeholder=" "
          isRequired
        />
        <Field
          name="fax"
          label={t('orgManagement.create_org.inputLabel.fax')}
          placeholder=" "
          component={Components['input']}
          isRequired
        />
      </div>
      <div className="headingBox">
        <p className="form-segment-title">{t('orgManagement.create_org.address_details')}</p>
      </div>
      <div>
        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 line-height">
          <Field
            name="address_1"
            label={t('orgManagement.create_org.inputLabel.address_1')}
            placeholder=" "
            isRequired
            component={Components['input']}
          />
          <Field
            name="address_2"
            label={t('orgManagement.create_org.inputLabel.address_2')}
            placeholder=" "
            component={Components['input']}
          />
        </div>
        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 line-height">
          <Field
            name="city"
            label={t('orgManagement.create_org.inputLabel.city')}
            placeholder=" "
            isRequired
            component={Components['input']}
          />
          <Field
            name="zip"
            label={t('orgManagement.create_org.inputLabel.zip')}
            placeholder=" "
            isRequired
            component={Components['input']}
          />
          <Field
            name="state"
            fieldlabel={t('orgManagement.create_org.inputLabel.state')}
            placeholder=" "
            component={Components['dropdown']}
            isRequired
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default OrgDetailsFormSegment;
