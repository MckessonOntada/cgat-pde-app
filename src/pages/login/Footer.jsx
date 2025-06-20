import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import { ReactComponent as McKessonLogoWhite } from '@src/assets/image/InspiroLinkWhite.svg';
import style from './assets/styles/Login.module.scss';

const Footer = () => {
  const { t } = useTranslate();
  return (
    <div className={style.loginFooter}>
      <div className={style.footerWrapper}>
        <div className={style.footerContant}>
          <div>
            <Heading as="h2">{t('footer.terms')}</Heading>
            <Link to={'https://www.ontadahealth.com/privacy-notice'} target="_blank">
              {t('footer.privacy')}
            </Link>
            <Link to={'https://privacyportal.onetrust.com/webform/599133ba-bafa-4e24-8173-6e59b6c96dab/f081c4ff-0e3b-4d07-a79f-30effc0fc255'} target="_blank">
              {t('footer.info')}
            </Link>
          </div>
          <div>
            <Heading as="h2">{t('footer.help')}</Heading>
            <Link to={'https://www.ontadahealth.com/help'} target="_blank">
              {t('footer.help.content')}
            </Link>
            <Link to={'#'} target="_blank">
              {t('footer.help.siteMap')}
            </Link>
          </div>
          <div>
            <Heading as="h2">{t('footer.contant')}</Heading>
            <Link to={'tel:1-855-887-6788'} target="_blank">
              {t('footer.contant.no')}
            </Link>
          </div>
        </div>
        <div className={style.footerBase}>
          <McKessonLogoWhite aria-hidden="true" focusable="false" title={t('company.logoAltText')} />
          <p>
            <span>{t('footer.copyright.1', { year: new Date().getFullYear() })}</span>
            {t('footer.copyright.2')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
