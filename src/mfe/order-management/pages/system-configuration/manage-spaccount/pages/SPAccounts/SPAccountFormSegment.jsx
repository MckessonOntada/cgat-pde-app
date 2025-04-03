import React from 'react';
import { Field } from 'formik';
import Components from '@src/components/form/Components';
import { Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { US_STATES } from '@src/components/form/util';
import StateDropdown from '@src/components/form/StateDropdown';

const SPAccountFormSegment = ({ comment }) => {
  const { t } = useTranslate();

  const options = US_STATES();
  options.unshift({
    isDisabled: true,
    value: '',
    label: t('orgManagement.create_org.option.please_select')
  });

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body form-container">
        <div className="headingBox firstHeading">
          <Heading as="h3">{t('manageSPAccount.heading.AccountDetails')}</Heading>
          <p className="form-instruction">
            <span className="required">* </span> {t('userManagement.create_user.required')}
          </p>
        </div>
        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline">
          <Field
            id="accountName"
            name="accountName"
            label={t('manageSPAccount.labels.accountName')}
            placeholder=" "
            isRequired
            component={Components['input']}
            maxLength={100}
          />
        </div>
        <div className="headingBox">
          <Heading as="h3">{t('manageSPAccount.heading.ContactDetails')}</Heading>
        </div>
        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline">
          <Field
            id="name.firstName"
            name="name.firstName"
            label={t('userManagement.create_user.inputLabel.first_name')}
            placeholder=" "
            isRequired
            component={Components['input']}
            maxLength={50}
          />
          <Field
            id="name.middleName"
            name="name.middleName"
            label={t('userManagement.create_user.inputLabel.middle_name')}
            placeholder=" "
            component={Components['input']}
            maxLength={50}
          />
          <Field
            name="name.lastName"
            label={t('userManagement.create_user.inputLabel.last_name')}
            placeholder=" "
            isRequired
            component={Components['input']}
            maxLength={50}
          />
          <Field
            name="contact.email"
            label={t('userManagement.create_user.inputLabel.email')}
            placeholder=" "
            isRequired
            component={Components['input']}
            maxLength={100}
          />
          <Field
            name="contact.phone"
            label={t('userManagement.create_user.inputLabel.phone_no')}
            component={Components['phoneInput']}
            className={'phoneInput'}
            placeholder=" "
            isRequired
          />
          <Field
            name="contact.fax"
            label={t('userManagement.create_user.inputLabel.fax')}
            placeholder=" "
            component={Components['input']}
            maxLength={15}
          />
        </div>
        <div className="headingBox">
          <Heading as="h3">{t('manageSPAccount.heading.AddressDetails')}</Heading>
        </div>
        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 align-items-baseline">
          <Field
            name="address.address1"
            label={t('userManagement.create_user.inputLabel.address_1')}
            placeholder=" "
            isRequired
            component={Components['input']}
            maxLength={100}
          />
          <Field
            name="address.address2"
            label={t('userManagement.create_user.inputLabel.address_2')}
            placeholder=" "
            component={Components['input']}
            maxLength={100}
          />
        </div>
        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 align-items-baseline">
          <Field
            name="address.city"
            label={t('userManagement.create_user.inputLabel.city')}
            placeholder=" "
            isRequired
            component={Components['input']}
            maxLength={50}
          />
          <Field
            name="address.zip"
            label={t('userManagement.create_user.inputLabel.zip')}
            placeholder=" "
            isRequired
            component={Components['zipInput']}
            maxLength={10}
          />
          <div className="corrected-dropdown">
            <Field
              name="address.state"
              label={t('userManagement.create_user.inputLabel.state')}
              placeholder=" "
              component={Components['stateDropdown']}
              isRequired
              options={options}
            />
          </div>

          {/* <StateDropdown /> */}
        </div>
        {comment && (
          <div className="commentWrap">
            <span>{t('label.comment')}</span>
            <p>{comment}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SPAccountFormSegment;
