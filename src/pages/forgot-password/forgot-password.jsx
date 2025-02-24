import React, { Fragment, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useLocation } from 'react-router-dom';
import { Button, InputField, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as McKessonLogo } from '@src/assets/image/McKesson_logo.svg';
import { useTranslate } from '@src/translations/useTranslation';
import '@src/pages/login/assets/styles/Login.css';
import style from '@src/pages/login/assets/styles/Login.module.scss';
import Footer from '../login/Footer';
import { useNavigate } from 'react-router-dom';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ForgotPassword = () => {
  const { oktaAuth } = useOktaAuth();
  const query = useQuery();
  const sessionUsername = sessionStorage.getItem('okta-widget-username') || '';
  const defaultEmail = query.get('email') || sessionUsername;
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState('');
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await oktaAuth.forgotPassword({
        username: email,
        factorType: 'EMAIL',
        redirectUri: `${window.location.origin}${location.pathname}`
      });
      setMessage('Your request to reset your password has been successfully submitted, Please check your email.');
    } catch (error) {
      setMessage('Error sending password reset email.');
    }
  };

  return (
  <div className={style.oktaRoot}>
    <div className={`${style.loginWrap} max-container`}>
      <div className={style.loginHeader}>
        <McKessonLogo aria-hidden="true" focusable="false" title={t('company.logoAltText')} />
        <Heading as="h2">
          <span>{t('login.header.1')} </span>
          {t('login.header.2')}
        </Heading>
        <p>
          <span>{t('login.page.desc.1')} </span>
          {t('login.page.desc.2')}
        </p>
      </div>
      
      <div className={style.loginContainor}>
        {!message ? (
          <>
            <p className={style.lWelcome}>{t('login.welcome')}</p>
            <Heading as="h3" className={style.lHead}>{t('login.ordringPortal')}</Heading>
            <p className={style.lDetails}>{t('login.details')}</p>
            <div className={style.forgotWrapper}>
                <form onSubmit={handleSubmit}>
                  <Heading as="h3">{t('forgot.password')}</Heading>
                  <div className={style.emailInput}>
                    <InputField
                      id="email"
                      isRequired
                      label="Email"
                      name="email"
                      value={email}
                      onInputChange={(e) => setEmail(e.target.value)}
                      useRegister={false}
                    />
                  </div>
                  <Button type="submit" size="lg">{t('forgot.password.submit')}</Button>
                </form>
            </div>
          </>
        ) : (
          <div className={style.message}>
            <Heading as="h3">{t('loginrequest.heading')}</Heading>
            <p>{message}</p>
            <Button type="submit" onClick={() => navigate('/login')} size="lg">{t('loginrequest.button')}</Button>
          </div>
        )}
      </div>
    </div>
    <Footer />
  </div>

  );
};

export default ForgotPassword;
