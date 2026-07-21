import React from 'react';
import './index.scss';
import '../index.scss';

import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as CheckIcon } from '@src/assets/svg/check-icon-success.svg';
import { ReactComponent as SupportIcon } from '@src/assets/svg/support-icon.svg';
import { ReactComponent as PhoneIcon } from '@src/assets/svg/call-icon.svg';
import { ReactComponent as EmailIcon } from '@src/assets/svg/mail-icon.svg';

const RequestSubmitted = ({ ticketId = '', phone = '', mail = '' }) => {
  return (
    <div className="request-submitted">
      <div className="success-icon">
        <div className="success-icon-inner">
          <CheckIcon className="success-check-icon" />
        </div>
      </div>

      <h2 className="request-title">Request submitted</h2>

      <p className="request-description">
        Our support team will review your case and respond within 1-2 business days. You'll receive a confirmation email shortly.
      </p>

      <div className="ticket-number">
        <span>{ticketId}</span>
      </div>

      <div className="support-card">
        <div className="support-header">
          <SupportIcon className="support-header-icon" />

          <div className="support-header-text">
            <span>Need immediate assistance?</span>

            <p>Our support team is available Monday - Friday, 8 am - 8 pm ET.</p>
          </div>
        </div>

        <div className="support-options">
          <div className="support-option">
            <PhoneIcon className="contact-icon" />

            <div className="support-text">
              <span className="label">CALL US</span>

              <span className="value">{phone}</span>
            </div>
          </div>

          <div className="support-option">
            <EmailIcon className="contact-icon" />

            <div className="support-text">
              <span className="label">EMAIL US</span>

              <span className="value">{mail}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="ticket-note">Save your ticket number for reference</p>

      <Button type="button" variant="primary" size="md" className="contact-form-submit-button" onClick={() => {}}>
        SUBMIT ANOTHER REQUEST
      </Button>
    </div>
  );
};

export default RequestSubmitted;
