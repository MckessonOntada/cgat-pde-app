import React from 'react';
import styles from './index.module.scss';
import contactUsStyles from '../ContactUs.module.scss';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as CheckIcon } from '@src/assets/svg/check-icon-success.svg';
import { ReactComponent as SupportIcon } from '@src/assets/svg/support-icon.svg';
import { ReactComponent as PhoneIcon } from '@src/assets/svg/call-icon.svg';
import { ReactComponent as EmailIcon } from '@src/assets/svg/mail-icon.svg';
import { useTranslate } from '@src/translations/useTranslation';

const RequestSubmitted = ({ submittedData, handleSubmitAnotherRequest }) => {
  const { t } = useTranslate();

  return (
    <div className={styles.requestSubmitted}>
      <div className={styles.successIcon}>
        <div className={styles.successIconInner}>
          <CheckIcon className={styles.successCheckIcon} />
        </div>
      </div>

      <h2 className={styles.requestTitle}>{t('contactUs.submittedPage.title')}</h2>

      <p className={styles.requestDescription}>{t('contactUs.submittedPage.description')}</p>

      <div className={styles.ticketNumber}>
        <span># {submittedData.ticketId}</span>
      </div>

      <div className={styles.supportCard}>
        <div className={styles.supportHeader}>
          <SupportIcon className={styles.supportHeaderIcon} />

          <div className={styles.supportHeaderText}>
            <span>{t('contactUs.submittedPage.support.title')}</span>

            <p>{t('contactUs.submittedPage.support.description')}</p>
          </div>
        </div>

        <div className={styles.supportOptions}>
          {submittedData.supportPhone && (
            <div className={styles.supportOption}>
              <PhoneIcon className={styles.contactIcon} />

              <div className={styles.supportText}>
                <span className={styles.label}>{t('contactUs.submittedPage.callUs')}</span>

                <span className={styles.value}>{submittedData.supportPhone}</span>
              </div>
            </div>
          )}

          <div className={styles.supportOption}>
            <EmailIcon className={styles.contactIcon} />

            <div className={styles.supportText}>
              <span className={styles.label}>{t('contactUs.submittedPage.emailUs')}</span>

              <span className={styles.value}>{submittedData.supportEmail}</span>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.ticketNote}>{t('contactUs.submittedPage.ticketNote')}</p>

      <Button type="button" variant="primary" size="md" className={contactUsStyles.contactFormSubmitButton} onClick={handleSubmitAnotherRequest}>
        {t('contactUs.submittedPage.submitAnotherRequest')}
      </Button>
    </div>
  );
};

export default RequestSubmitted;
