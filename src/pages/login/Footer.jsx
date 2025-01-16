import React from "react"; 
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';
import { Link } from "react-router-dom";
import { ReactComponent as McKessonLogoWhite } from '@src/assets/image/mckesson-logo-white.svg';
import style from './assets/styles/Login.module.scss';

const Footer = () => {
  const { t } = useTranslate();
  return (
    <div className={style.loginFooter}>
        <div className={style.footerWrapper}>
            <div className={style.footerContant}>
                <div>
                    <Heading as="h2">{t('footer.terms')}</Heading>
                    <Link to={''}>{t('footer.privacy')}</Link>
                    <Link to={''}>{t('footer.info')}</Link>
                </div>
                <div>
                    <Heading as="h2">{t('footer.help')}</Heading>
                    <Link to={''}>{t('footer.help.content')}</Link>
                </div>
                <div>
                    <Heading as="h2">{t('footer.contant')}</Heading>
                    <Link to={''}>{t('footer.contant.no')}</Link>
                </div>
            </div>
            <div className={style.footerBase}>
                <McKessonLogoWhite aria-hidden="true" focusable="false" title={t('company.logoAltText')} />
                <p>{t('footer.copyright')}</p>
            </div>
        </div>
    </div>
  );
};

export default Footer;