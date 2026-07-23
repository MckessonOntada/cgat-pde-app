import React from 'react';
import './index.scss';
import '../index.scss';

import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as CheckIcon } from '@src/assets/svg/check-icon-success.svg';
import { ReactComponent as SupportIcon } from '@src/assets/svg/support-icon.svg';
import { ReactComponent as PhoneIcon } from '@src/assets/svg/call-icon.svg';
import { ReactComponent as EmailIcon } from '@src/assets/svg/mail-icon.svg';
import { useTranslate } from '@src/translations/useTranslation';

const RequestSubmitted = ({ ticketId = '', phone = '', mail = '' }) => {
  const { t } = useTranslate();
  return (
    <div className="request-submitted">
      <div className="success-icon">
        <div className="success-icon-inner">
          <CheckIcon className="success-check-icon" />
        </div>
      </div>

      <h2 className="request-title">{t('contactUs.submittedPage.title')}</h2>

      <p className="request-description">{t('contactUs.submittedPage.description')}</p>

      <div className="ticket-number">
        <span>{ticketId}</span>
      </div>

      <div className="support-card">
        <div className="support-header">
          <SupportIcon className="support-header-icon" />

          <div className="support-header-text">
            <span>{t('contactUs.submittedPage.support.title')}</span>

            <p>{t('contactUs.submittedPage.support.description')}</p>
          </div>
        </div>

        <div className="support-options">
          <div className="support-option">
            <PhoneIcon className="contact-icon" />

            <div className="support-text">
              <span className="label">{t('contactUs.submittedPage.callUs')}</span>

              <span className="value">{phone}</span>
            </div>
          </div>

          <div className="support-option">
            <EmailIcon className="contact-icon" />

            <div className="support-text">
              <span className="label">{t('contactUs.submittedPage.emailUs')}</span>

              <span className="value">{mail}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="ticket-note">{t('contactUs.submittedPage.ticketNote')}</p>

      <Button type="button" variant="primary" size="md" className="contact-form-submit-button" onClick={() => {}}>
        {t('contactUs.submittedPage.submitAnotherRequest')}
      </Button>
    </div>
  );
};

export default RequestSubmitted;
