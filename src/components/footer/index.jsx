import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import style from './assets/Footer.module.scss';
import { Heading } from '@mckesson/mcp-component-library';
import useSessionFeatures from '@src/hooks/useSessionFeatures';
import CommonDataService from '@src/api/commonService/CommonDataService';
import AuthUtils from '@src/util/AuthUtils';
import { ReactComponent as AppLogo } from '@src/assets/image/app-logo.svg';
import footerLinks from '@src/components/footer/data/footerLinks.json';

const Footer = () => {
  const { t } = useTranslate();
  const {
    organization: { selectedOrganization }
  } = useSessionFeatures();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { data: organizationLogo } = CommonDataService.useOrganizationLogo(selectedOrganization.logoUrl, selectedOrganization.id);

  return (
    <footer className={style.footer}>
      <div className={`max-container ${style.footerWrapper}`}>
        <div className={style.footerContent}>
          {footerLinks.sections.map((section, index) => (
            <div key={index}>
              <Heading as="h2">{t(section.heading)}</Heading>
              {section.links.map((link, linkIndex) => (
                <Link key={linkIndex} to={link.url} target="_blank">
                  {t(link.text)}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className={style.footerBase}>
          <div className={style.branding}>
            {isSystemAdminView ? (
              <AppLogo aria-hidden="true" focusable="false" title="PDE Logo" />
            ) : (
              <Link className={`${style.customheader}`}>
                {organizationLogo && (
                  <div className={`${style.logoContainer}`}>
                    <img src={organizationLogo || ''} alt="Organization Logo" />
                  </div>
                )}
                <h2>{selectedOrganization.name}</h2>
              </Link>
            )}
          </div>
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
