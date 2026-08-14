import React from 'react';
import { Field } from 'formik';

import styles from './ContactUs.module.scss';
import { useTranslate } from '@src/translations/useTranslation';
import Components from '@src/components/form/Components';
import StepHeader from './StepHeader';

const PersonalDetails = ({ step = 1 }) => {
  const { t } = useTranslate();
  return (
    <div className={styles.personalDetails}>
      <StepHeader step={step} title={t('contactUs.personalDetails.title')} />

      <div className={styles.personalDetailsGrid}>
        <Field
          id="firstName"
          name="firstName"
          component={Components['input']}
          label={t('contactUs.personalDetails.label.firstName')}
          placeholder=" "
          isRequired
          maxLength={50}
        />

        <Field
          id="lastName"
          name="lastName"
          component={Components['input']}
          label={t('contactUs.personalDetails.label.lastName')}
          placeholder=" "
          isRequired
          maxLength={50}
        />

        <Field
          id="email"
          name="email"
          component={Components['input']}
          label={t('contactUs.personalDetails.label.email')}
          placeholder=" "
          isRequired
          type="email"
          maxLength={100}
        />

        <Field
          id="phoneNumber"
          name="phoneNumber"
          component={Components['phoneInput']}
          className={'phoneInput'}
          label={t('contactUs.personalDetails.label.phoneNumber')}
          placeholder=" "
          isRequired
        />
      </div>
    </div>
  );
};

export default PersonalDetails;
