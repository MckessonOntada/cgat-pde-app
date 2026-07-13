import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import AuthUtils from '@src/util/AuthUtils';
import { ReactComponent as McKessonLogo } from '@src/assets/svg/pagelogo.svg';
import { Heading } from '@mckesson/mcp-component-library';
import './index.scss';

const ContactUsLoggedIn = () => {
  const { t } = useTranslate();
  const [searchParams] = useSearchParams();
  const nameFromUrl = searchParams.get('name');
  const fullName = nameFromUrl ? decodeURIComponent(nameFromUrl) : (AuthUtils.getFullName() || AuthUtils.getUserName() || 'User');

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(fullName);

  return (
    <div className="contact-container">
      <PrimaryHeader />

      <div className="contact-content">
        <div className="contact-card">
          <div className="contact-card-header">
            <div className="logo-section">
              <McKessonLogo aria-hidden="true" focusable="false" className="brand-logo" />
            </div>

            <div className="user-profile-section">
              <div className="user-avatar">{initials}</div>
              <div className="user-details">
                <span className="user-name">{fullName}</span>
                <span className="user-status">Signed in</span>
              </div>
            </div>
          </div>

          <div className="contact-card-body">
            {/* Progress Indicator */}
            <div className="progress-indicator-bar">
              <div className="progress-step active"></div>
              <div className="progress-step"></div>
              <div className="progress-step"></div>
              <div className="progress-step"></div>
            </div>

            <Heading as="h1" className="body-heading">Contact Us</Heading>
            <p className="body-subheading">
              Tell us what you need help with and we'll route it to the right team.
            </p>

            {/* Form */}
            <div>
              {/* Tab */}
              {/* form */}
              <span>Contact us form</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsLoggedIn;
